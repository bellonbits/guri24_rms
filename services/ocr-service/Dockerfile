# =============================================================================
# Allen AI olmOCR GPU Inference Service (allenai/olmOCR-2-7B-1025-FP8)
# Requires an NVIDIA GPU node with >= 12 GB VRAM and CUDA 12+
# Repository: https://github.com/allenai/olmocr
# =============================================================================
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV OLMOCR_MODEL="allenai/olmOCR-2-7B-1025-FP8"
ENV PORT=8090

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv poppler-utils libgl1 curl git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/olmocr

RUN pip3 install --no-cache-dir \
    fastapi==0.115.5 \
    uvicorn[standard]==0.32.1 \
    pydantic==2.10.2 \
    pypdf==5.1.0 \
    pillow==11.0.0 \
    httpx==0.28.0 \
    olmocr

COPY server.py /opt/olmocr/server.py

EXPOSE 8090

HEALTHCHECK --interval=20s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8090/health || exit 1

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8090"]
