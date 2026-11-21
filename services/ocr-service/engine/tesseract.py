import os
import shutil
import subprocess
from typing import Dict, List, Optional, Tuple
from PIL import Image
import pytesseract
from pytesseract import Output

from config import settings
from models import WordBox


class TesseractEngine:
    """Manages the Tesseract OCR engine, language verification, and word data extraction."""

    def __init__(self, tesseract_cmd: Optional[str] = None):
        cmd = tesseract_cmd or settings.TESSERACT_CMD or "tesseract"
        resolved = shutil.which(cmd) or (cmd if os.path.exists(cmd) else None)
        if resolved:
            pytesseract.pytesseract.tesseract_cmd = resolved
            self.tesseract_path = resolved
            self.is_available = True
        else:
            # Fallback check standard locations
            std_paths = ["/usr/bin/tesseract", "/usr/local/bin/tesseract", "/opt/homebrew/bin/tesseract"]
            found = next((p for p in std_paths if os.path.exists(p)), None)
            if found:
                pytesseract.pytesseract.tesseract_cmd = found
                self.tesseract_path = found
                self.is_available = True
            else:
                self.tesseract_path = None
                self.is_available = False

    def get_version(self) -> Optional[str]:
        """Returns the installed Tesseract version string or None."""
        if not self.is_available:
            return None
        try:
            return str(pytesseract.get_tesseract_version())
        except Exception:
            return None

    def get_installed_languages(self) -> List[str]:
        """
        Retrieves the exact list of installed Tesseract traineddata languages.
        Never reports uninstalled languages.
        """
        if not self.is_available:
            return []
        try:
            langs = pytesseract.get_languages()
            return sorted(langs)
        except Exception:
            return []

    def validate_language(self, lang: str) -> str:
        """Verifies that requested language is physically installed, defaulting safely to 'eng'."""
        installed = self.get_installed_languages()
        if lang in installed:
            return lang
        if "eng" in installed:
            return "eng"
        return installed[0] if installed else "eng"

    def extract_image_text_and_words(
        self,
        image: Image.Image,
        lang: str = "eng",
        page_num: int = 1,
    ) -> Tuple[str, float, List[WordBox]]:
        """
        Runs Tesseract OCR on a PIL Image.
        Returns (raw_text, average_confidence, word_boxes).
        Captures word-level bounding boxes and confidence estimates using image_to_data().
        """
        if not self.is_available:
            raise RuntimeError(
                "Tesseract OCR binary is not installed or available on this system. "
                "Install tesseract-ocr to enable scanned image OCR."
            )

        validated_lang = self.validate_language(lang)
        custom_config = r"--oem 3 --psm 3"

        # 1. Capture word-level bounding boxes and confidence estimates using image_to_data
        data_dict = pytesseract.image_to_data(
            image,
            lang=validated_lang,
            config=custom_config,
            output_type=Output.DICT,
        )

        word_boxes: List[WordBox] = []
        valid_confidences: List[float] = []
        text_lines: List[str] = []
        current_line_words: List[str] = []
        last_line_num = -1

        n_boxes = len(data_dict["text"])
        for i in range(n_boxes):
            word_text = data_dict["text"][i].strip()
            conf = float(data_dict["conf"][i])

            if word_text and conf >= 0:
                valid_confidences.append(conf)
                box = WordBox(
                    text=word_text,
                    left=int(data_dict["left"][i]),
                    top=int(data_dict["top"][i]),
                    width=int(data_dict["width"][i]),
                    height=int(data_dict["height"][i]),
                    confidence=round(conf, 2),
                    page_num=page_num,
                )
                word_boxes.append(box)

                line_num = data_dict["line_num"][i]
                if line_num != last_line_num and current_line_words:
                    text_lines.append(" ".join(current_line_words))
                    current_line_words = []
                current_line_words.append(word_text)
                last_line_num = line_num

        if current_line_words:
            text_lines.append(" ".join(current_line_words))

        raw_text = "\n".join(text_lines)
        overall_conf = (
            round(sum(valid_confidences) / len(valid_confidences), 2)
            if valid_confidences
            else 0.0
        )

        return raw_text, overall_conf, word_boxes


tesseract_engine = TesseractEngine()
