import os
import time
from pathlib import Path
from ..config import settings, UPLOADS_DIR

def cleanup_old_temp_files(max_age_minutes: int = settings.TEMP_FILE_MAX_AGE_MINUTES):
    """
    Scans the uploads and reports directory and deletes files older than max_age_minutes.
    """
    now = time.time()
    cutoff = now - (max_age_minutes * 60)
    
    cleaned_count = 0
    for directory in [UPLOADS_DIR]:
        if directory.exists():
            for file_path in directory.iterdir():
                if file_path.is_file():
                    try:
                        mtime = file_path.stat().st_mtime
                        if mtime < cutoff:
                            file_path.unlink()
                            cleaned_count += 1
                    except Exception as e:
                        print(f"[Cleanup] Error deleting {file_path}: {e}")
                        
    return cleaned_count
