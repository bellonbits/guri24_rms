import io
import pytest
import numpy as np
from PIL import Image, ImageDraw

from engine.preprocessor import ImagePreprocessor
from engine.pdf_processor import PdfProcessor
import pypdf


def test_preprocessor_deskew_and_binarization():
    # Create a synthetic image with high-contrast text lines
    img = Image.new("RGB", (300, 100), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((20, 30), "GURI24 RENTAL MANAGEMENT", fill=(0, 0, 0))
    draw.text((20, 60), "TENANCY AGREEMENT NAIROBI", fill=(0, 0, 0))

    # Preprocess
    enhanced, skew_angle = ImagePreprocessor.preprocess_for_ocr(img)

    assert enhanced.size == (300, 100)
    assert isinstance(skew_angle, float)
    # Binary image should only contain 0 and 255 values
    np_arr = np.array(enhanced)
    unique_vals = set(np.unique(np_arr))
    assert unique_vals.issubset({0, 255})


def test_pdf_processor_digital_text():
    # Build a real in-memory digital PDF using pypdf
    writer = pypdf.PdfWriter()
    page = writer.add_blank_page(width=595, height=842)
    # We can write an actual PDF stream or test extract_from_pdf_bytes with a small valid digital PDF
    pdf_buffer = io.BytesIO()
    writer.write(pdf_buffer)
    pdf_bytes = pdf_buffer.getvalue()

    text, conf, pages = PdfProcessor.extract_from_pdf_bytes(pdf_bytes)
    assert len(pages) == 1
    assert pages[0].page_number == 1
