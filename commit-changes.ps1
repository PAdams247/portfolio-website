# Portfolio Website - Smart Commit Script
# This script helps you commit changes and automatically updates the README

param(
    [string]$Message = "",
    [switch]$UpdateReadme = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Portfolio Website - Smart Commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    git --version | Out-Null
} catch {
    Write-Host "ERROR: Git is not available" -ForegroundColor Red
    Write-Host "Please ensure Git is installed and restart terminal" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Show current status
Write-Host "Current repository status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Get commit message if not provided
if (-not $Message) {
    $Message = Read-Host "Enter commit message (describe your changes)"
    if (-not $Message) {
        Write-Host "ERROR: Commit message cannot be empty" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if there are changes to commit
$changes = git status --porcelain
if (-not $changes) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

# Update README if requested or if significant changes detected
$shouldUpdateReadme = $UpdateReadme
if (-not $shouldUpdateReadme) {
    # Check for significant changes that warrant README update
    $significantFiles = @("src/", "package.json", "public/", "*.md")
    foreach ($file in $significantFiles) {
        if ($changes -match $file) {
            $response = Read-Host "Significant changes detected. Update README with change summary? (y/n)"
            if ($response -eq "y" -or $response -eq "Y") {
                $shouldUpdateReadme = $true
                break
            }
        }
    }
}

if ($shouldUpdateReadme) {
    Write-Host "Updating README with latest changes..." -ForegroundColor Green
    
    # Get current date
    $date = Get-Date -Format "yyyy-MM-dd"
    
    # Prepare README update
    $readmePath = "README.md"
    if (Test-Path $readmePath) {
        $readmeContent = Get-Content $readmePath -Raw
        
        # Add update section if it doesn't exist
        if ($readmeContent -notmatch "## 📈 Recent Updates") {
            $updateSection = @"

## 📈 Recent Updates

### $date
- $Message

"@
            # Insert after the first heading
            $readmeContent = $readmeContent -replace "(# Portfolio Website)", "`$1$updateSection"
        } else {
            # Add to existing updates section
            $newUpdate = "### $date`n- $Message`n"
            $readmeContent = $readmeContent -replace "(## 📈 Recent Updates)", "`$1`n`n$newUpdate"
        }
        
        # Write updated content
        Set-Content -Path $readmePath -Value $readmeContent -Encoding UTF8
        Write-Host "README updated with change summary" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m $Message

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS! Changes pushed to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your website will update automatically in 5-10 minutes" -ForegroundColor Cyan
Write-Host "Check GitHub Actions for deployment status" -ForegroundColor Cyan
Write-Host ""

# Show the repository URL
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    $repoUrl = $remoteUrl -replace "\.git$", ""
    Write-Host "Repository: $repoUrl" -ForegroundColor Cyan
    Write-Host "Actions: $repoUrl/actions" -ForegroundColor Cyan
}

Read-Host "Press Enter to exit"