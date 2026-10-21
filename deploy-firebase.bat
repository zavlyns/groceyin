@echo off
title GroceryIn - Deploy ke Firebase Hosting
echo ============================================================
echo   GROCERYIN: DEPLOY KE FIREBASE HOSTING (grocery1n.web.app)
echo ============================================================
echo.
echo [1/2] Membuka login Firebase di browser...
echo Silakan klik akun Google Anda di jendela browser yang terbuka.
echo.
call npx firebase-tools login
echo.
echo [2/2] Mengupload file aplikasi ke hosting...
call npx firebase-tools deploy --only hosting
echo.
echo ============================================================
echo   BERHASIL! Website GroceryIn sekarang AKTIF di HP:
echo   👉 https://grocery1n.web.app
echo   👉 https://grocery1n.firebaseapp.com
echo ============================================================
pause
