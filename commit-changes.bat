@echo off
echo ========================================
echo Portfolio Website - Commit Changes
echo ========================================
echo.

REM Check if Git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not available
    echo Please ensure Git is installed and restart terminal
    pause
    exit /b 1
)

echo Current repository status:
git status --short
echo.

REM Get commit message from user
set /p COMMIT_MSG="Enter commit message (describe your changes): "

if "%COMMIT_MSG%"=="" (
    echo ERROR: Commit message cannot be empty
    pause
    exit /b 1
)

echo.
echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Your website will update automatically in 5-10 minutes
echo Check GitHub Actions for deployment status
echo.
pause