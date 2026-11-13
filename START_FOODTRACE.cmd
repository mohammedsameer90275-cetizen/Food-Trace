@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ================================================
echo FoodTrace Local Launcher
echo Django backend: http://127.0.0.1:8000
echo Vite frontend:  http://127.0.0.1:5173
echo ================================================
echo.

where python >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON_CMD=python"
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    set "PYTHON_CMD=py -3"
  ) else (
    echo Python was not found. Install Python 3.11+ and run this file again.
    pause
    exit /b 1
  )
)

where npm.cmd >nul 2>nul
if not %errorlevel%==0 (
  echo Node.js/npm was not found. Install Node.js LTS and run this file again.
  pause
  exit /b 1
)

if not exist "backend\.venv\Scripts\python.exe" (
  echo Creating backend virtual environment...
  %PYTHON_CMD% -m venv "backend\.venv"
  if not %errorlevel%==0 (
    echo Failed to create Python virtual environment.
    pause
    exit /b 1
  )
)

echo Installing backend dependencies...
"%ROOT%backend\.venv\Scripts\python.exe" -m pip install --upgrade pip
"%ROOT%backend\.venv\Scripts\python.exe" -m pip install -r "%ROOT%backend\requirements.txt"
if not %errorlevel%==0 (
  echo Backend dependency install failed.
  pause
  exit /b 1
)

echo Preparing clean Django database...
"%ROOT%backend\.venv\Scripts\python.exe" "%ROOT%backend\manage.py" migrate
"%ROOT%backend\.venv\Scripts\python.exe" "%ROOT%backend\manage.py" seed_foodtrace
if not %errorlevel%==0 (
  echo Database setup failed.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  npm.cmd install --prefix "%ROOT%frontend"
  if not %errorlevel%==0 (
    echo Frontend dependency install failed.
    pause
    exit /b 1
  )
)

echo Starting Django backend...
start "FoodTrace Django Backend" cmd /k "cd /d ""%ROOT%backend"" && ""%ROOT%backend\.venv\Scripts\python.exe"" manage.py runserver 127.0.0.1:8000"

echo Starting React Vite frontend...
start "FoodTrace React Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

timeout /t 5 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo.
echo FoodTrace is starting. Keep the backend and frontend windows open while using the app.
echo Default admin login: admin / Admin@123
pause
