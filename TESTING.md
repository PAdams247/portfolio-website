# Portfolio Website - Testing Documentation

## Overview

This portfolio website includes a comprehensive test suite covering all major components and functionality. The tests are built using Jest and React Testing Library.

## Test Coverage

### Components Tested

1. **Game2048** (`src/pages/Game2048.tsx`)
   - Game initialization and board setup
   - Arrow key controls (keyboard and mobile)
   - Tile movement and merging logic
   - Score tracking and game states
   - Win/lose conditions

2. **Tetris** (`src/pages/Tetris.tsx`)
   - Game board rendering
   - Tetromino piece movement and rotation
   - Line clearing mechanics
   - Game loop and timing
   - Pause/resume functionality

3. **TaskList** (`src/pages/TaskList.tsx`)
   - Task creation, editing, and deletion
   - Task filtering (all, active, completed)
   - Priority and category management
   - Local storage integration
   - Task statistics

4. **Navigation** (`src/components/Navigation.tsx`)
   - Route navigation
   - Mobile menu functionality
   - Active link highlighting
   - Accessibility features

5. **SpinningGraphic** (`src/components/SpinningGraphic.tsx`)
   - Component structure and rendering
   - Animation elements
   - Accessibility attributes

6. **App** (`src/App.tsx`)
   - Routing configuration
   - Component integration
   - Error handling

## Bug Fixes

### Game2048 Arrow Key Issue

**Problem**: Arrow keys (except UP) were not working correctly due to incorrect board rotation logic.

**Root Cause**: In the `move` function, line 108 was using `currentBoard` instead of `newBoard` for the final rotation back to the original orientation.

**Fix**: Changed the rotation logic to use `newBoard` and properly track the board state through rotations:

```typescript
// Before (buggy)
for (let i = 0; i < (4 - rotations) % 4; i++) {
  currentBoard = rotateBoard(newBoard);  // Wrong variable used
}

// After (fixed)
let finalBoard = newBoard;
for (let i = 0; i < (4 - rotations) % 4; i++) {
  finalBoard = rotateBoard(finalBoard);  // Correct variable tracking
}
```

## Running Tests

### Prerequisites

```bash
npm install
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci

# Run comprehensive test suite (includes linting, type checking, build)
./run-tests.sh
```

### Test Structure

```
src/
├── __tests__/
│   ├── App.test.tsx
│   ├── Game2048.test.tsx
│   ├── Navigation.test.tsx
│   ├── SpinningGraphic.test.tsx
│   ├── TaskList.test.tsx
│   └── Tetris.test.tsx
├── setupTests.ts
└── ...
```

## Test Categories

### Unit Tests
- Component rendering
- Function logic
- State management
- Event handling

### Integration Tests
- Component interactions
- Routing behavior
- Local storage integration

### Accessibility Tests
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

### Performance Tests
- Rendering efficiency
- Memory usage
- Animation performance

## Coverage Goals

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## Mocking Strategy

### Browser APIs
- `localStorage` and `sessionStorage`
- `IntersectionObserver` and `ResizeObserver`
- `matchMedia` for responsive design
- Keyboard and mouse events

### External Dependencies
- CSS imports
- React Router components
- Animation libraries

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Component Testing
- Test user interactions, not implementation details
- Use `data-testid` attributes for reliable element selection
- Mock external dependencies appropriately

### Async Testing
- Use `waitFor` for async operations
- Handle promises and timeouts properly
- Test loading and error states

## Continuous Integration

The test suite is designed to run in CI environments:

```bash
npm run test:ci
```

This command:
- Runs all tests once (no watch mode)
- Generates coverage reports
- Exits with appropriate status codes

## Debugging Tests

### Common Issues

1. **Timer-related tests**: Use `jest.useFakeTimers()` for game loops
2. **Router tests**: Wrap components with `MemoryRouter`
3. **LocalStorage**: Mock storage APIs in `setupTests.ts`
4. **CSS imports**: Mock CSS files to avoid import errors

### Debugging Commands

```bash
# Run specific test file
npm test Game2048.test.tsx

# Run tests in debug mode
npm test -- --verbose

# Run tests with coverage details
npm test -- --coverage --verbose
```

## Contributing

When adding new features:

1. Write tests for new components
2. Update existing tests for modified functionality
3. Ensure coverage thresholds are maintained
4. Add integration tests for complex interactions

## Test Data

Test data is generated dynamically or mocked appropriately:
- Game boards use predictable random seeds
- User interactions are simulated with Testing Library
- API responses are mocked with consistent data structures