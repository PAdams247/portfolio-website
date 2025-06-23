# GitHub Setup Guide for Portfolio Website

This guide will help you set up Git, create a GitHub repository, and deploy your portfolio website.

## 📋 Prerequisites

### 1. Install Git

**Windows:**
1. Download Git from [https://git-scm.com/download/windows](https://git-scm.com/download/windows)
2. Run the installer with default settings
3. Restart your terminal/PowerShell
4. Verify installation: `git --version`

**macOS:**
```bash
# Using Homebrew
brew install git

# Or download from https://git-scm.com/download/mac
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### 2. Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 🚀 Setting Up Your Repository

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd portfolio-website

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio website with games and comprehensive test suite

- Add 2048 game with fixed arrow key controls
- Add Tetris game with full functionality
- Add Task List manager with local storage
- Add comprehensive unit test suite (163 tests)
- Add CI/CD pipeline with GitHub Actions
- Add responsive design with glassmorphism UI
- Fix Game2048 arrow key rotation bug
- Add accessibility features and mobile controls"
```

### Step 2: Create GitHub Repository

1. **Go to GitHub**: Visit [https://github.com](https://github.com)
2. **Sign in** to your account (or create one)
3. **Create new repository**:
   - Click the "+" icon → "New repository"
   - Repository name: `portfolio-website`
   - Description: "Interactive portfolio website with games built in React & TypeScript"
   - Make it **Public** (for GitHub Pages)
   - **Don't** initialize with README (we already have one)
   - Click "Create repository"

### Step 3: Connect Local Repository to GitHub

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🌐 Setting Up GitHub Pages

### Option 1: Automatic Deployment (Recommended)

The GitHub Actions workflow will automatically deploy your site when you push to the `main` branch.

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click "Save"

2. **Update package.json**:
   - Replace `your-username` in the homepage URL with your GitHub username
   - The workflow will handle the rest automatically

### Option 2: Manual Deployment

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

## 📝 Repository Structure

After setup, your repository will have:

```
portfolio-website/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── public/                    # Static assets
├── src/                       # Source code
├── .gitignore                # Git ignore rules
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT license
├── README.md                 # Project documentation
├── TESTING.md               # Testing documentation
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🔄 Development Workflow

### Making Changes

```bash
# Create a new branch for features
git checkout -b feature/new-game

# Make your changes
# ... edit files ...

# Stage and commit changes
git add .
git commit -m "feat: add new puzzle game"

# Push to GitHub
git push origin feature/new-game

# Create Pull Request on GitHub
```

### Updating Main Branch

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge feature branch (or use GitHub PR)
git merge feature/new-game

# Push updates
git push origin main
```

## 🧪 Continuous Integration

The GitHub Actions workflow will automatically:

1. **Run tests** on every push and pull request
2. **Check TypeScript** compilation
3. **Build the project** to ensure it works
4. **Deploy to GitHub Pages** when pushing to main
5. **Generate coverage reports**

### Workflow Triggers

- **Push to main**: Full CI/CD pipeline with deployment
- **Push to other branches**: Testing and building only
- **Pull requests**: Full testing suite

## 🌍 Accessing Your Website

After deployment, your website will be available at:
```
https://YOUR_USERNAME.github.io/portfolio-website
```

### Custom Domain (Optional)

1. **Buy a domain** from a registrar
2. **Configure DNS** to point to GitHub Pages:
   - Add CNAME record: `www.yourdomain.com` → `YOUR_USERNAME.github.io`
   - Add A records for apex domain to GitHub's IPs
3. **Update repository settings**:
   - Go to Settings → Pages
   - Add your custom domain
   - Enable "Enforce HTTPS"

## 🔧 Troubleshooting

### Common Issues

**Git not recognized:**
- Restart terminal after installing Git
- Add Git to PATH environment variable

**Permission denied (publickey):**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/portfolio-website.git
```

**Deployment fails:**
- Check GitHub Actions logs
- Ensure all tests pass locally
- Verify package.json homepage URL

**Website not loading:**
- Wait 5-10 minutes after first deployment
- Check GitHub Pages settings
- Verify build folder contents

### Getting Help

1. **Check GitHub Actions logs** for deployment issues
2. **Run tests locally** to catch issues early:
   ```bash
   npm test
   npm run build
   ```
3. **Create an issue** in the repository for bugs
4. **Check GitHub Pages documentation** for deployment help

## 📊 Monitoring

### GitHub Insights

Monitor your repository with:
- **Traffic**: Visitor statistics
- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Actions**: CI/CD pipeline status

### Analytics (Optional)

Add Google Analytics to track website usage:
1. Create Google Analytics account
2. Add tracking code to `public/index.html`
3. Monitor visitor statistics

## 🎉 Next Steps

After setup:

1. **Customize the content** with your information
2. **Add more games** or projects
3. **Improve the design** based on feedback
4. **Share your portfolio** with potential employers
5. **Keep adding features** and improvements

## 📞 Support

If you need help:
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: Direct contact for urgent issues

---

🎊 **Congratulations!** Your portfolio website is now live on GitHub and ready to showcase your coding skills!