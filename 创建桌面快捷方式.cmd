@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0desktop\create-shortcut.ps1"
if errorlevel 1 (
  echo Shortcut creation failed. See the message above.
  pause
  exit /b 1
)
pause
