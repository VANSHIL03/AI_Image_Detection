import fs from 'fs';
import { execSync } from 'child_process';

if (fs.existsSync('frontend')) {
  console.log('[Build] Building from root directory...');
  execSync('npm --prefix frontend install', { stdio: 'inherit' });
  execSync('npm --prefix frontend run build', { stdio: 'inherit' });
  
  // Copy frontend/dist to ./dist so root outputDirectory 'dist' always exists
  if (fs.existsSync('frontend/dist')) {
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
    console.log('[Build] Mirrored frontend/dist to ./dist');
  }
} else {
  console.log('[Build] Building inside frontend directory...');
  execSync('npx vite build', { stdio: 'inherit' });
}
