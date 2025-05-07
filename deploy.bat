@echo off
echo Memulai proses build dan deploy...

REM 1. Membersihkan folder .next (cache lama)
if exist ".next" rmdir /s /q ".next"

REM 2. Menginstall dependency
call npm install

REM 3. Membuild aplikasi Next.js
call npm run build

REM 4. Membuat folder deploy
if exist deploy rmdir /s /q deploy
mkdir deploy

REM 5. Menyalin hasil build ke folder deploy
xcopy /E /I /Y ".next" "deploy\.next"
xcopy /E /I /Y "public" "deploy\public"
copy /Y package.json deploy\
copy /Y next.config.js deploy\
copy /Y netlify.toml deploy\

echo.
echo ✅ Build selesai! Folder 'deploy' sudah siap untuk di-upload ke Netlify.
echo.
echo Langkah selanjutnya:
echo 1. Buka https://app.netlify.com
echo 2. Drag and drop folder 'deploy' ke area deploy
echo.
pause > nul
