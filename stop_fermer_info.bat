@echo off
setlocal

echo [Fermer-Info] Frontend va Backend jarayonlari to'xtatilmoqda...
echo.

REM Aniq loyiha nomi bilan ochilgan CMD oynalarni (va ularning ichidagi node/vite.exe jarayonlarini) yopamiz
taskkill /F /FI "WINDOWTITLE eq Fermer-Info Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Fermer-Info Frontend*" /T >nul 2>&1

if %errorlevel%==0 (
  echo [OK] Loyiha jarayonlari xavfsiz to'xtatildi.
) else (
  echo [INFO] To'xtatiladigan loyiha jarayonlari topilmadi yoki allaqachon yopilgan.
)

echo.
pause
