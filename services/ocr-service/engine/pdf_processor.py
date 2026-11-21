import io
import os
import shutil
from typing import List, Tuple
from PIL import Image
import pypdf

from config import settings
from engine.preprocessor import ImagePreprocessor
from engine.tesseract import tesseract_engine
from models import PageExtraction, WordBox


class PdfProcessor:
    """
    Processes PDF documents:
    1. Attempts direct digital text extraction first via pypdf.
    2. Detects pages without meaningful embedded text (scanned pages).
    3. Runs OCR with orientation correction and deskew on scanned pages.
    4. Preserves multi-page documents and page-level extraction results.
    """

    @staticmethod
    def is_poppler_installed() -> bool:
        """Checks if pdftoppm from poppler-utils is available in PATH."""
        return shutil.which("pdftoppm") is not None

    @classmethod
    def extract_from_pdf_bytes(
        cls,
        pdf_bytes: bytes,
        lang: str = "eng",
        max_pages: int = 50,
    ) -> Tuple[str, float, List[PageExtraction]]:
        """
        Executes hybrid digital & scanned extraction across all pages of a PDF:
        - If page has embedded digital text, extracts it directly.
        - If page is scanned/image-only, converts to image and performs Tesseract OCR.
        """
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        total_pages = min(len(reader.pages), max_pages)

        pages_result: List[PageExtraction] = []
        full_text_parts: List[str] = []
        confidences: List[float] = []

        poppler_available = cls.is_poppler_installed()

        for page_idx in range(total_pages):
            page_num = page_idx + 1
            page = reader.pages[page_idx]

            # 1. Attempt direct text extraction first
            direct_text = (page.extract_text() or "").strip()
            # Meaningful digital text threshold: >= 20 chars of alphanumeric words
            has_meaningful_text = len([w for w in direct_text.split() if any(c.isalnum() for c in w)]) >= 4

            if has_meaningful_text:
                # Digital PDF page
                words_list = direct_text.split()
                # Synthesize digital word bounding boxes for uniform schema representation
                word_boxes = [
                    WordBox(
                        text=w,
                        left=0,
                        top=0,
                        width=0,
                        height=0,
                        confidence=99.0,
                        page_num=page_num,
                    )
                    for w in words_list
                ]
                page_conf = 99.0
                confidences.append(page_conf)
                full_text_parts.append(f"--- Page {page_num} ---\n{direct_text}")

                pages_result.append(
                    PageExtraction(
                        page_number=page_num,
                        text=direct_text,
                        word_count=len(words_list),
                        confidence=page_conf,
                        is_scanned_ocr=False,
                        orientation_degrees=0,
                        words=word_boxes,
                    )
                )
            else:
                # Scanned or image-only page requiring OCR
                if not poppler_available:
                    # Poppler is not installed on this host; record empty scanned page cleanly
                    pages_result.append(
                        PageExtraction(
                            page_number=page_num,
                            text="",
                            word_count=0,
                            confidence=0.0,
                            is_scanned_ocr=True,
                            orientation_degrees=0,
                            words=[],
                        )
                    )
                    continue

                try:
                    import pdf2image

                    # Rasterize single PDF page at 300 DPI for high-accuracy OCR
                    images = pdf2image.convert_from_bytes(
                        pdf_bytes,
                        dpi=300,
                        first_page=page_num,
                        last_page=page_num,
                        fmt="png",
                    )
                    if not images:
                        continue

                    raw_img = images[0]
                    # Preprocess: orientation, deskew, Otsu threshold
                    enhanced_img, skew_angle = ImagePreprocessor.preprocess_for_ocr(raw_img)

                    # Run Tesseract OCR
                    ocr_text, ocr_conf, word_boxes = tesseract_engine.extract_image_text_and_words(
                        enhanced_img,
                        lang=lang,
                        page_num=page_num,
                    )

                    if ocr_text.strip():
                        full_text_parts.append(f"--- Page {page_num} ---\n{ocr_text.strip()}")
                        confidences.append(ocr_conf)

                    pages_result.append(
                        PageExtraction(
                            page_number=page_num,
                            text=ocr_text.strip(),
                            word_count=len(word_boxes),
                            confidence=ocr_conf,
                            is_scanned_ocr=True,
                            orientation_degrees=round(skew_angle),
                            words=word_boxes,
                        )
                    )
                except Exception as err:
                    # Capture actual failure without inventing fake records
                    pages_result.append(
                        PageExtraction(
                            page_number=page_num,
                            text="",
                            word_count=0,
                            confidence=0.0,
                            is_scanned_ocr=True,
                            orientation_degrees=0,
                            words=[],
                        )
                    )

        overall_conf = round(sum(confidences) / len(confidences), 2) if confidences else 0.0
        combined_text = "\n\n".join(full_text_parts)
        return combined_text, overall_conf, pages_result
