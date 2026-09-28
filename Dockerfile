FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for OpenCV / image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and models
COPY backend/ ./backend/
COPY models/ ./models/

ENV PYTHONPATH=/app/backend
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
