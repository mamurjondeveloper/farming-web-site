@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

echo [Fermer-Info] Backend va Frontend loyihalari ishga tushirilmoqda...
echo.

REM Backend ishga tushiruvchi oyna
start "Fermer-Info Backend" /d "%BACKEND_DIR%" cmd /k npm run dev

timeout /t 3 /nobreak >nul

REM Frontend ishga tushiruvchi oyna
start "Fermer-Info Frontend" /d "%FRONTEND_DIR%" cmd /k npm run dev

echo [Xabar] Ishga tushirish buyruqlari muvaffaqiyatli yuborildi.
echo [BACKEND] Odatda:  http://localhost:5000
echo [FRONTEND] Odatda: http://localhost:5173 
echo.
echo Dasturlar yangi qor oyna(cmd) larida ochildi. Bu oynani yopishingiz mumkin.
pause

