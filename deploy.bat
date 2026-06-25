@echo off
setlocal enabledelayedexpansion
echo ==============================================
echo [1/4] Running local build to check for errors...
echo ==============================================
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Local build failed! Deployment aborted. Please fix errors before deploying.
    pause
    exit /b %errorlevel%
)
echo.
echo [SUCCESS] Local build succeeded!
echo.

echo ==============================================
echo [2/4] Checking and committing local changes...
echo ==============================================
git status --porcelain | findstr /R "^" > nul
if %errorlevel% equ 0 (
    set "commit_msg="
    set /p commit_msg="Enter commit message (or press Enter for default): "
    if "!commit_msg!"=="" (
        set "commit_msg=Deploy: Automatic deployment update"
    )
    git add .
    git commit -m "!commit_msg!"
    echo.
    echo [SUCCESS] Changes committed.
) else (
    echo No new changes to commit.
)
echo.

echo ==============================================
echo [3/4] Pushing changes to GitHub...
echo ==============================================
git push origin master
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git push failed! Deployment aborted.
    pause
    exit /b %errorlevel%
)
echo.
echo [SUCCESS] Pushed to GitHub.
echo.

echo ==============================================
echo [4/4] Deploying to Production Server...
echo ==============================================
ssh -o StrictHostKeyChecking=no -i "D:\asb-lps\asianschoolofbusiness.asb.edu.in.pem" ubuntu@10.9.151.3 "cd asb-nextjs-lps && git fetch origin && git reset --hard origin/master && npm run build && pm2 reload asb-next"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Production server deployment failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ==============================================
echo [SUCCESS] Deployment completed successfully! Site is live.
echo ==============================================
pause
