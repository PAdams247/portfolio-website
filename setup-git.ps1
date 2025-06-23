# Portfolio Website Git Setup Script for Windows
# Run this script in PowerShell as Administrator

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$UserName,
    
    [Parameter(Mandatory=$true)]
    [string]$UserEmail
)

Write-Host "🚀 Portfolio Website Git Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is already installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/windows" -ForegroundColor Yellow
    Write-Host "   Then restart PowerShell and run this script again." -ForegroundColor Yellow
    exit 1
}

# Configure Git
Write-Host "🔧 Configuring Git..." -ForegroundColor Yellow
git config --global user.name "$UserName"
git config --global user.email "$UserEmail"
Write-Host "✅ Git configured successfully" -ForegroundColor Green

# Initialize repository
Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already exists" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
$commitMessage = @"
Initial commit: Portfolio website with games and comprehensive test suite

- Add 2048 game with fixed arrow key controls
- Add Tetris game with full functionality  
- Add Task List manager with local storage
- Add comprehensive unit test suite (163 tests)
- Add CI/CD pipeline with GitHub Actions
- Add responsive design with glassmorphism UI
- Fix Game2048 arrow key rotation bug
- Add accessibility features and mobile controls
"@

git commit -m "$commitMessage"
Write-Host "✅ Initial commit created" -ForegroundColor Green

# Add remote origin
Write-Host "🌐 Adding GitHub remote..." -ForegroundColor Yellow
$repoUrl = "https://github.com/$GitHubUsername/portfolio-website.git"
try {
    git remote add origin $repoUrl
    Write-Host "✅ Remote origin added: $repoUrl" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Remote origin might already exist" -ForegroundColor Yellow
    git remote set-url origin $repoUrl
    Write-Host "✅ Remote origin updated: $repoUrl" -ForegroundColor Green
}

# Set main branch and push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
try {
    git branch -M main
    git push -u origin main
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub. Please check:" -ForegroundColor Red
    Write-Host "   1. Repository exists on GitHub" -ForegroundColor Yellow
    Write-Host "   2. You have push permissions" -ForegroundColor Yellow
    Write-Host "   3. GitHub username is correct" -ForegroundColor Yellow
}

# Update package.json homepage
Write-Host "📦 Updating package.json homepage..." -ForegroundColor Yellow
$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    $packageJson.homepage = "https://$GitHubUsername.github.io/portfolio-website"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    Write-Host "✅ Package.json updated with correct homepage" -ForegroundColor Green
    
    # Commit the package.json update
    git add package.json
    git commit -m "chore: update homepage URL in package.json"
    git push origin main
    Write-Host "✅ Homepage URL committed and pushed" -ForegroundColor Green
} else {
    Write-Host "⚠️  package.json not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Your portfolio website is now on GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Repository URL: https://github.com/$GitHubUsername/portfolio-website" -ForegroundColor White
Write-Host "🌐 Website URL: https://$GitHubUsername.github.io/portfolio-website" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Enable GitHub Pages in Settings > Pages" -ForegroundColor White
Write-Host "3. Wait 5-10 minutes for deployment" -ForegroundColor White
Write-Host "4. Visit your website!" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Check GITHUB_SETUP.md for detailed instructions." -ForegroundColor Cyan