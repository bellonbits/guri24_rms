import io
import math
from typing import Tuple
import cv2
import numpy as np
from PIL import Image, ImageOps


class ImagePreprocessor:
    """Preprocesses document images for optimal OCR accuracy with Tesseract."""

    @staticmethod
    def fix_exif_orientation(image: Image.Image) -> Image.Image:
        """Corrects image orientation according to EXIF metadata."""
        try:
            return ImageOps.exif_transpose(image)
        except Exception:
            return image

    @classmethod
    def pil_to_cv2(cls, pil_image: Image.Image) -> np.ndarray:
        """Converts a PIL Image to an OpenCV BGR numpy array."""
        image = cls.fix_exif_orientation(pil_image)
        if image.mode != "RGB":
            image = image.convert("RGB")
        return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    @staticmethod
    def cv2_to_pil(cv_image: np.ndarray) -> Image.Image:
        """Converts an OpenCV BGR numpy array back to PIL Image."""
        if len(cv_image.shape) == 2:
            return Image.fromarray(cv_image)
        rgb = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb)

    @classmethod
    def compute_skew_angle(cls, gray_image: np.ndarray) -> float:
        """Computes the skew angle of text lines in degrees using minAreaRect on edge points."""
        try:
            # Invert colors: text as white pixels, background as black
            thresh = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
            coords = np.column_stack(np.where(thresh > 0))
            if len(coords) < 50:
                return 0.0

            angle = cv2.minAreaRect(coords)[-1]
            # minAreaRect returns angle in range [-90, 0)
            if angle < -45:
                angle = -(90 + angle)
            elif angle > 45:
                angle = 90 - angle
            else:
                angle = -angle

            # Clamp extreme spurious angles
            if abs(angle) > 30.0:
                return 0.0
            return float(angle)
        except Exception:
            return 0.0

    @classmethod
    def deskew(cls, cv_image: np.ndarray) -> Tuple[np.ndarray, float]:
        """Calculates skew angle and rotates the image to make text horizontal."""
        if len(cv_image.shape) == 3:
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = cv_image

        angle = cls.compute_skew_angle(gray)
        if abs(angle) < 0.3:
            return cv_image, 0.0

        (h, w) = cv_image.shape[:2]
        center = (w // 2, h // 2)
        m = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            cv_image,
            m,
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE,
        )
        return rotated, angle

    @classmethod
    def preprocess_for_ocr(cls, pil_image: Image.Image) -> Tuple[Image.Image, float]:
        """
        Runs the full document image enhancement pipeline:
        1. EXIF orientation correction
        2. Conversion to grayscale
        3. Deskewing
        4. Noise removal & Otsu adaptive thresholding
        Returns (enhanced_pil_image, applied_skew_angle)
        """
        cv_img = cls.pil_to_cv2(pil_image)
        deskewed, angle = cls.deskew(cv_img)

        # Convert to grayscale
        if len(deskewed.shape) == 3:
            gray = cv2.cvtColor(deskewed, cv2.COLOR_BGR2GRAY)
        else:
            gray = deskewed

        # Slight Gaussian blur to reduce high-frequency scan artifacts
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        # Otsu thresholding creates clean high-contrast black/white pixels for Tesseract
        binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

        enhanced_pil = Image.fromarray(binary)
        return enhanced_pil, angle
