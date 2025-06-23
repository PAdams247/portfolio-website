# Contributing to Portfolio Website

Thank you for your interest in contributing to this portfolio website! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the problem
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding standards
4. **Add tests** for new functionality
5. **Run the test suite** to ensure nothing is broken:
   ```bash
   npm test
   npm run test:coverage
   ```
6. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "feat: add new game feature"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** with a clear description

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Formatting**: Use consistent formatting (consider using Prettier)
- **Naming**: Use descriptive variable and function names

### Component Guidelines

- **Functional Components**: Use functional components with hooks
- **Props**: Define proper TypeScript interfaces for props
- **State**: Use appropriate React hooks for state management
- **Effects**: Clean up effects properly to prevent memory leaks

### Testing Requirements

- **Unit Tests**: Write unit tests for all new components
- **Integration Tests**: Add integration tests for complex features
- **Coverage**: Maintain test coverage above 70%
- **Test Structure**: Follow the AAA pattern (Arrange, Act, Assert)

### Game Development

- **Performance**: Optimize game loops and rendering
- **Controls**: Support both keyboard and touch controls
- **Accessibility**: Ensure games are accessible
- **Mobile**: Test on mobile devices

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── styles/             # CSS files
├── __tests__/          # Test files
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

### Adding New Games

1. Create the game component in `src/pages/`
2. Add corresponding CSS file in `src/styles/`
3. Add route in `App.tsx`
4. Update navigation in `Navigation.tsx`
5. Write comprehensive tests
6. Update documentation

### Adding New Components

1. Create component in appropriate directory
2. Export from index file if needed
3. Add TypeScript interfaces
4. Write unit tests
5. Document props and usage

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test ComponentName.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Writing Tests

- **Test files**: Place tests in `__tests__` directory
- **Naming**: Use `.test.tsx` extension
- **Structure**: Group related tests with `describe` blocks
- **Mocking**: Mock external dependencies appropriately
- **Async**: Use `waitFor` for async operations

### Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Game Logic Tests**: Test game mechanics and rules
- **Accessibility Tests**: Test ARIA attributes and keyboard navigation

## 🎨 Design Guidelines

### UI/UX Principles

- **Responsive**: Design for all screen sizes
- **Accessible**: Follow WCAG guidelines
- **Consistent**: Use consistent spacing and colors
- **Performance**: Optimize for fast loading

### Color Scheme

- Primary: `#00d4ff` (cyan)
- Secondary: `#ff6b6b` (coral)
- Background: Dark gradient
- Text: `#e0e0e0` (light gray)

### Typography

- Headers: 'Orbitron' font
- Body: 'Roboto Mono' font
- Consistent font sizes and line heights

## 🚀 Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages when changes are merged to `main`.

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 📝 Commit Message Format

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

Examples:
```
feat: add new tetris game mode
fix: resolve arrow key issue in 2048 game
docs: update README with new features
test: add unit tests for task list component
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps**: Step-by-step reproduction instructions
3. **Expected**: What you expected to happen
4. **Actual**: What actually happened
5. **Environment**: Browser, OS, device information
6. **Screenshots**: Visual evidence if applicable

## 💡 Feature Requests

For new features:

1. **Use Case**: Explain why the feature is needed
2. **Description**: Detailed description of the feature
3. **Mockups**: Visual mockups if applicable
4. **Implementation**: Suggestions for implementation

## 📞 Getting Help

- **Issues**: Create an issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact the maintainer directly for sensitive issues

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for major features or fixes

Thank you for contributing to make this portfolio website better! 🎉