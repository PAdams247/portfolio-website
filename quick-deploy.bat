@echo off
echo ========================================
echo Quick Deploy - Portfolio Website
echo ========================================
echo.

echo Committing workflow improvements...
git add .
git commit -m "fix: improve GitHub Actions workflow for reliable deployment"
git push origin main

echo.
echo Deploying to gh-pages...
npm run deploy

echo.
echo ========================================
echo Deployment commands completed!
echo ========================================
echo.
echo Check your website in 2-3 minutes at:
echo https://padams247.github.io/portfolio-website
echo.
echo If it's not working, check:
echo 1. GitHub Actions: https://github.com/padams247/portfolio-website/actions
echo 2. GitHub Pages: https://github.com/padams247/portfolio-website/settings/pages
echo.
pause