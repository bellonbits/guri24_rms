# =============================================================================
# Guri24 RMS — Python Tesseract OCR & Document Intelligence Service
# Engine: Tesseract OCR (pytesseract) + OpenCV + Poppler (pdf2image) + pypdf
# =============================================================================
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000

# Install Tesseract OCR, English trained data, Poppler utilities, OpenCV deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Verify system Tesseract binary and installed languages at build time
RUN tesseract --version && tesseract --list-langs

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . /app/

EXPOSE 8000

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
