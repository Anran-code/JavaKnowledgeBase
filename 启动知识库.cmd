@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 启动后请打开 http://127.0.0.1:5178
call npm.cmd run dev
pause
