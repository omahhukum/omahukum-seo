@echo off
echo Memulai proses build dan deploy...

echo 1. Membersihkan cache...
rmdir /s /q .next
rmdir /s /q out

echo 2. Install dependencies...
call npm install

echo 3. Build aplikasi...
call npm run build

echo 4. Membuat folder deploy...
mkdir deploy
xcopy /E /I /Y .next deploy\.next
xcopy /E /I /Y public deploy\public
copy package.json deploy\
copy next.config.js deploy\
copy netlify.toml deploy\

echo 5. Build selesai! Folder deploy siap untuk di-upload ke Netlify
echo.
echo Langkah selanjutnya:
echo 1. Buka https://app.netlify.com
echo 2. Drag and drop folder 'deploy' ke area deploy
echo.
echo Tekan tombol apa saja untuk keluar...
pause > nul 