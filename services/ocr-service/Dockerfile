# =============================================================================
# Allen AI olmOCR Inference Service Adapter for Guri24 RMS
# Repository: https://github.com/allenai/olmocr
# =============================================================================
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV OLMOCR_MODEL="allenai/olmOCR-2-7B-1025-FP8"
ENV PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils libgl1 curl git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/olmocr

RUN pip3 install --no-cache-dir \
    fastapi==0.115.5 \
    uvicorn[standard]==0.32.1 \
    pydantic==2.10.2 \
    pypdf==5.1.0 \
    pillow==11.0.0 \
    httpx==0.28.0

COPY server.py /opt/olmocr/server.py

EXPOSE 8000

HEALTHCHECK --interval=20s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
