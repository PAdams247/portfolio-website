# Portfolio Website

A modern, interactive portfolio website showcasing coding projects and games built with React and TypeScript.

## 🌟 Features

### Interactive Games
- **2048 Game** - Classic sliding puzzle game with smooth animations and **fixed arrow key controls**
- **Tetris** - Full-featured Tetris implementation with scoring and levels
- **Task List Manager** - Comprehensive task management with categories and priorities

### Modern UI/UX
- Responsive design that works on all devices
- Glassmorphism-inspired design with smooth animations
- Dark theme with gradient accents
- Mobile-friendly controls for games

### Technical Highlights
- Built with React 18 and TypeScript
- **Comprehensive unit test suite** with Jest and React Testing Library (163 tests)
- Local storage integration for persistent data
- Keyboard and touch controls
- Accessibility features
- **CI/CD pipeline** with GitHub Actions

## 🚀 Quick Setup

### For GitHub Deployment

**Windows (PowerShell as Administrator):**
```powershell
.\setup-git.ps1 -GitHubUsername "your-username" -UserName "Your Name" -UserEmail "your@email.com"
```

**macOS/Linux (Terminal):**
```bash
chmod +x setup-git.sh
./setup-git.sh your-username "Your Name" "your@email.com"
```

**Manual Setup:**
See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for detailed instructions.

### For Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧪 Testing

This project includes a comprehensive test suite covering all components and functionality.

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run comprehensive test suite
./run-tests.sh
```

### Test Coverage
- **163 total tests** across 6 test suites
- **Components**: All major components have unit tests
- **Game Logic**: Complete coverage of game mechanics
- **User Interactions**: Keyboard, mouse, and touch events
- **Routing**: Navigation and route handling
- **Local Storage**: Data persistence functionality

For detailed testing information, see [TESTING.md](./TESTING.md).

## 🎮 Games & Features

### 2048 Game ✅ **Bug Fixed**
- **Controls**: Arrow keys or on-screen buttons
- **Features**: Score tracking, win/lose detection, smooth animations
- **Mobile**: Touch-friendly controls
- **Fix Applied**: Arrow key controls now work in all directions

### Tetris
- **Controls**: Arrow keys for movement, spacebar for hard drop, P for pause
- **Features**: Line clearing, level progression, next piece preview
- **Scoring**: Points based on lines cleared and level

### Task List Manager
- **Features**: Add, edit, delete tasks
- **Organization**: Categories and priority levels
- **Filtering**: View all, active, or completed tasks
- **Persistence**: Data saved to local storage

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, CSS3
- **Routing**: React Router DOM
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
portfolio-website/
├── .github/workflows/     # CI/CD pipeline
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   ├── __tests__/       # Test files
│   └── ...
├── GITHUB_SETUP.md      # Setup instructions
├── TESTING.md           # Testing documentation
├── CONTRIBUTING.md      # Contribution guidelines
├── setup-git.ps1        # Windows setup script
├── setup-git.sh         # macOS/Linux setup script
└── README.md           # This file
```

## 🐛 Bug Fixes

### Game2048 Arrow Key Issue (Fixed) ✅
- **Problem**: Arrow keys (except UP) weren't working correctly
- **Cause**: Incorrect board rotation logic in the move function
- **Solution**: Fixed rotation logic to properly track board state through transformations
- **Result**: All arrow keys now work perfectly in all directions

## 🚀 Deployment

### GitHub Pages (Automated)
The site automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Deployment
```bash
npm run build
npm run deploy
```

Your website will be available at: `https://your-username.github.io/portfolio-website`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📊 Quality Metrics

- **Test Coverage**: 163 comprehensive tests
- **TypeScript**: 100% TypeScript codebase
- **Accessibility**: ARIA compliant
- **Performance**: Optimized React components
- **CI/CD**: Automated testing and deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Portfolio: [Your Website](https://your-website.com)

## 🙏 Acknowledgments

- React team for the amazing framework
- Create React App for the build setup
- Testing Library for excellent testing utilities
- All open source contributors

---

⭐ **Star this repository if you found it helpful!**

🚀 **Ready to showcase your coding skills? Follow the setup guide and get your portfolio live in minutes!**