import os
import sys
import subprocess
import time
import signal
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"

def print_banner():
    banner = r"""
  ===================================================================
    ___  _   _ ____    _    _     _____ _   _ ____       _    ___ 
   / _ \| | | |  _ \  / \  | |   | ____| \ | / ___|     / \  |_ _|
  / /_\ | | | | |_) |/ _ \ | |   |  _| |  \| \___ \    / _ \  | | 
  |  _  | |_| |  _ </ ___ \| |___| |___| |\  |___) |  / ___ \ | | 
  |_| |_|\___/|_| \_\_/   \_\_____|_____|_| \_|____/  /_/   \_\___|
  
   AI-Generated Image & Video Detection Platform (v2.0)
   Enterprise Edition • Deep Learning & Digital Forensics
  ===================================================================
    """
    print(banner)

def main():
    print_banner()
    
    # 1. Hardware & Environment Checks
    print("[1/3] Checking environment and accelerator...")
    try:
        import torch
        if torch.cuda.is_available():
            print(f"  [+] CUDA Hardware Acceleration: ON ({torch.cuda.get_device_name(0)})")
        else:
            print("  [i] Hardware Acceleration: CPU Fallback Mode")
    except Exception:
        print("  [i] PyTorch check skipped")

    # 2. Start FastAPI Backend
    print("\n[2/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=str(BACKEND_DIR)
    )

    # Allow backend 1.5 seconds to bind
    time.sleep(1.5)

    # 3. Start Vite React Frontend
    print("\n[3/3] Starting React Vite Frontend on http://127.0.0.1:5173 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        shell=(os.name == "nt")
    )

    print("\n" + "="*65)
    print("  [+] AuraLens AI is LIVE and Running!")
    print("  -------------------------------------------------------------")
    print("  -> Frontend UI:             http://localhost:5173")
    print("  -> Backend API:             http://localhost:8000")
    print("  -> Swagger API Docs:        http://localhost:8000/docs")
    print("  -> Alternative ReDoc:       http://localhost:8000/redoc")
    print("  -------------------------------------------------------------")
    print("  Press Ctrl+C to terminate both servers safely.")
    print("="*65 + "\n")

    try:
        while True:
            time.sleep(1)
            # Check if any process terminated prematurely
            if backend_proc.poll() is not None:
                print("\n[!] Backend process stopped.")
                break
            if frontend_proc.poll() is not None:
                print("\n[!] Frontend process stopped.")
                break
    except KeyboardInterrupt:
        print("\n[*] Shutting down servers cleanly...")
    finally:
        if backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc.poll() is None:
            frontend_proc.terminate()
        print("[*] All services stopped. Goodbye!")

if __name__ == "__main__":
    main()
