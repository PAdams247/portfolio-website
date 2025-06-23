#!/bin/bash

# Portfolio Website Git Setup Script for macOS/Linux
# Usage: ./setup-git.sh <github-username> <your-name> <your-email>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${CYAN}$1${NC}"
}

# Check arguments
if [ $# -ne 3 ]; then
    print_error "Usage: $0 <github-username> <your-name> <your-email>"
    print_error "Example: $0 johndoe 'John Doe' 'john@example.com'"
    exit 1
fi

GITHUB_USERNAME=$1
USER_NAME=$2
USER_EMAIL=$3

print_header "🚀 Portfolio Website Git Setup"
print_header "================================"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first:"
    echo "  macOS: brew install git"
    echo "  Ubuntu/Debian: sudo apt install git"
    echo "  CentOS/RHEL: sudo yum install git"
    exit 1
fi

GIT_VERSION=$(git --version)
print_success "Git is installed: $GIT_VERSION"

# Configure Git
print_status "Configuring Git..."
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"
print_success "Git configured successfully"

# Initialize repository
print_status "Initializing Git repository..."
if [ -d ".git" ]; then
    print_warning "Git repository already exists"
else
    git init
    print_success "Git repository initialized"
fi

# Add all files
print_status "Adding files to Git..."
git add .

# Create initial commit
print_status "Creating initial commit..."
COMMIT_MESSAGE="Initial commit: Portfolio website with games and comprehensive test suite

- Add 2048 game with fixed arrow key controls
- Add Tetris game with full functionality  
- Add Task List manager with local storage
- Add comprehensive unit test suite (163 tests)
- Add CI/CD pipeline with GitHub Actions
- Add responsive design with glassmorphism UI
- Fix Game2048 arrow key rotation bug
- Add accessibility features and mobile controls"

git commit -m "$COMMIT_MESSAGE"
print_success "Initial commit created"

# Add remote origin
print_status "Adding GitHub remote..."
REPO_URL="https://github.com/$GITHUB_USERNAME/portfolio-website.git"
if git remote get-url origin &> /dev/null; then
    print_warning "Remote origin already exists, updating..."
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi
print_success "Remote origin set: $REPO_URL"

# Set main branch and push
print_status "Pushing to GitHub..."
git branch -M main
if git push -u origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub. Please check:"
    echo "  1. Repository exists on GitHub"
    echo "  2. You have push permissions"
    echo "  3. GitHub username is correct"
    exit 1
fi

# Update package.json homepage
print_status "Updating package.json homepage..."
if [ -f "package.json" ]; then
    # Use sed to update the homepage URL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|\"homepage\": \".*\"|\"homepage\": \"https://$GITHUB_USERNAME.github.io/portfolio-website\"|" package.json
    else
        # Linux
        sed -i "s|\"homepage\": \".*\"|\"homepage\": \"https://$GITHUB_USERNAME.github.io/portfolio-website\"|" package.json
    fi
    
    print_success "Package.json updated with correct homepage"
    
    # Commit the package.json update
    git add package.json
    git commit -m "chore: update homepage URL in package.json"
    git push origin main
    print_success "Homepage URL committed and pushed"
else
    print_warning "package.json not found"
fi

echo ""
print_header "🎉 Setup Complete!"
print_header "=================="
print_success "Your portfolio website is now on GitHub!"
echo ""
echo -e "📍 Repository URL: ${CYAN}https://github.com/$GITHUB_USERNAME/portfolio-website${NC}"
echo -e "🌐 Website URL: ${CYAN}https://$GITHUB_USERNAME.github.io/portfolio-website${NC}"
echo ""
print_warning "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Enable GitHub Pages in Settings > Pages"
echo "3. Wait 5-10 minutes for deployment"
echo "4. Visit your website!"
echo ""
print_status "Need help? Check GITHUB_SETUP.md for detailed instructions."