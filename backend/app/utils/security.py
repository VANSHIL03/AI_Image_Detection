import os
import re
from fastapi import HTTPException, UploadFile
from ..config import settings

# Magic byte signatures
MAGIC_NUMBERS = {
    # Images
    b"\xFF\xD8\xFF": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",  # WebP or AVI container
    b"BM": "image/bmp",
    # Videos
    b"\x00\x00\x00\x18ftyp": "video/mp4",
    b"\x00\x00\x00\x20ftyp": "video/mp4",
    b"\x00\x00\x00\x1cftyp": "video/mp4",
    b"\x1a\x45\xdf\xa3": "video/webm", # MKV/WebM Matroska
}

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal and unsafe characters."""
    base = os.path.basename(filename)
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', base)
    if not clean_name:
        clean_name = "upload_media"
    return clean_name

async def validate_uploaded_image(file: UploadFile) -> tuple[bytes, str]:
    """Validate image file size, extension, and header bytes."""
    filename = sanitize_filename(file.filename or "unknown.jpg")
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    if len(content) > settings.MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=413, 
            detail=f"Image exceeds maximum size of {settings.MAX_IMAGE_SIZE_BYTES // (1024*1024)}MB."
        )
    
    # Check magic bytes
    is_valid_image = False
    for signature in [b"\xFF\xD8\xFF", b"\x89PNG\r\n\x1a\n", b"RIFF", b"BM"]:
        if content.startswith(signature):
            is_valid_image = True
            break
            
    if not is_valid_image:
        # Fallback check file extension
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".bmp"]:
            raise HTTPException(
                status_code=400, 
                detail="Invalid image format. Supported formats: JPG, PNG, WEBP, BMP."
            )
            
    return content, filename

async def validate_uploaded_video(file: UploadFile) -> tuple[bytes, str]:
    """Validate video file size, extension, and headers."""
    filename = sanitize_filename(file.filename or "unknown.mp4")
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded video file is empty.")
        
    if len(content) > settings.MAX_VIDEO_SIZE_BYTES:
        raise HTTPException(
            status_code=413, 
            detail=f"Video exceeds maximum size of {settings.MAX_VIDEO_SIZE_BYTES // (1024*1024)}MB."
        )
        
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".mp4", ".mov", ".avi", ".webm", ".mkv"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid video format. Supported formats: MP4, MOV, AVI, WEBM, MKV."
        )
        
    return content, filename
