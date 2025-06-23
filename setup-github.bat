@echo off
echo ========================================
echo Portfolio Website GitHub Setup
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/windows
    echo Then restart this script.
    pause
    exit /b 1
)

echo Git is installed successfully!
echo.

REM Get user input
set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p USER_NAME="Enter your full name: "
set /p USER_EMAIL="Enter your email address: "

echo.
echo Setting up Git configuration...
git config --global user.name "%USER_NAME%"
git config --global user.email "%USER_EMAIL%"

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Portfolio website with games and comprehensive test suite

🎮 Games & Features:
- Add 2048 game with fixed arrow key controls (all directions working)
- Add Tetris game with full functionality and level progression
- Add Task List manager with local storage and filtering
- Add responsive design with glassmorphism UI and mobile controls

🧪 Testing & Quality:
- Add comprehensive unit test suite (163 tests across 6 components)
- Add CI/CD pipeline with GitHub Actions for automated testing
- Add TypeScript for type safety and better development experience
- Add accessibility features with ARIA labels and keyboard navigation

🐛 Bug Fixes:
- Fix Game2048 arrow key rotation bug (LEFT, RIGHT, DOWN now work correctly)
- Fix board state tracking through rotation transformations

📚 Documentation:
- Add comprehensive README with setup instructions
- Add TESTING.md with detailed testing information
- Add CONTRIBUTING.md with development guidelines
- Add GitHub setup scripts for Windows and macOS/Linux
- Add MIT license and proper project structure

🚀 Deployment:
- Add GitHub Pages deployment configuration
- Add automated deployment on push to main branch
- Add package.json scripts for easy deployment
- Add .gitignore for proper version control

This portfolio demonstrates proficiency in:
- React 18 & TypeScript development
- Comprehensive unit testing with Jest & React Testing Library
- Game development with complex state management
- Responsive web design and accessibility
- CI/CD pipeline setup and deployment automation
- Professional documentation and project organization"

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%GITHUB_USERNAME%/portfolio-website.git

echo.
echo Setting main branch and pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo SUCCESS! Your portfolio is now on GitHub!
echo ========================================
echo.
echo Repository: https://github.com/%GITHUB_USERNAME%/portfolio-website
echo Website: https:///%GITHUB_USERNAME%.github.io/portfolio-website
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Click Settings ^> Pages
echo 3. Set source to "Deploy from a branch"
echo 4. Select "gh-pages" branch
echo 5. Wait 5-10 minutes for deployment
echo.
echo Your portfolio website will be live shortly!
echo ========================================
pause