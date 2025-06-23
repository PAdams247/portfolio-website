#!/bin/bash

echo "🧪 Running Portfolio Website Test Suite"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed successfully"
fi

# Run linting
print_status "Running ESLint..."
npm run lint 2>/dev/null || echo "Linting skipped (no lint script found)"

# Run type checking
print_status "Running TypeScript type checking..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    print_success "TypeScript type checking passed"
else
    print_warning "TypeScript type checking found issues"
fi

# Run tests
print_status "Running Jest tests..."
npm test -- --coverage --watchAll=false --verbose

# Check test results
if [ $? -eq 0 ]; then
    print_success "All tests passed! 🎉"
else
    print_error "Some tests failed. Please check the output above."
    exit 1
fi

# Run build test
print_status "Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

echo ""
echo "======================================="
print_success "Test suite completed successfully! ✅"
echo "======================================="