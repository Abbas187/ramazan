@echo off
cd /d "%~dp0"

echo --- Ramazan App GitHub Push ---

:: Check if git is initialized
if not exist .git (
    echo Initializing Git...
    git init
    git remote add origin https://github.com/Abbas187/ramazan.git
)

:: Check for Git Identity
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Git identity not found. Setting temporary local identity...
    git config --local user.email "user@example.com"
    git config --local user.name "Abbas"
)

echo Adding files...
git add .

echo Committing...
git commit -m "Ramazan App: Initial Push"

echo.
echo Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. 
    echo 1. Ensure the repository exists at https://github.com/Abbas187/ramazan
    echo 2. Ensure you have the correct permissions.
    echo 3. You may need to login in the popup window.
) else (
    echo.
    echo [SUCCESS] Code pushed successfully!
)

pause
