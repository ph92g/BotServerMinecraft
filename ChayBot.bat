@echo off
cd /d "%~dp0"
echo Dang kiem tra va cai dat thu vien...
call npm install mineflayer @google/generative-ai
echo Dang khoi dong bot...
node index.js
pause