@echo off
title Nova Shop - Start Server
echo.
echo  Starting XAMPP Apache and MySQL for Nova Shop...
echo.

if exist "C:\xampp\apache_start.bat" (
    call "C:\xampp\apache_start.bat"
) else (
    echo ERROR: XAMPP not found at C:\xampp
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul
call "C:\xampp\mysql_start.bat"
timeout /t 3 /nobreak >nul

echo.
echo  ============================================
echo   Nova Shop is ready!
echo  ============================================
echo.
echo   Open in browser:
echo   http://localhost/nova-shop/
echo.
echo   Admin login:  admin / password
echo.
echo   Stop servers: XAMPP Control Panel - Stop Apache and MySQL
echo  ============================================
echo.

start "" "http://localhost/nova-shop/"

pause
