# Testing Guide - Waykeeper Brand Hub

This document provides comprehensive information about the testing setup for the Waykeeper Brand Hub.

## Testing Stack

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Accessibility Tests**: Playwright + axe-core
- **Performance Tests**: Lighthouse CI
- **CI/CD**: GitHub Actions

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run all tests (unit + E2E)
npm run test:all
```

## Test Structure

### Unit Tests (`__tests__/`)

```
__tests__/
├── components/
│   ├── ColorPalette.test.tsx
│   ├── Header.test.tsx
│   ├── VoiceTonePlayground.test.tsx
│   ├── AssetLibrary.test.tsx
│   └── BrandComplianceChecker.test.tsx
└── lib/
    └── utils.test.ts
```

### E2E Tests (`tests/e2e/`)

```
tests/e2e/
├── color-palette.spec.ts
├── navigation.spec.ts
├── voice-tone-playground.spec.ts
├── asset-library.spec.ts
├── brand-compliance-checker.spec.ts
├── homepage.spec.ts
└── accessibility.spec.ts
```

## Test Coverage

### Unit Test Coverage

- **Components**: All major components are tested
- **Utils**: Utility functions are tested
- **Coverage Threshold**: 70% minimum
- **Coverage Reports**: Generated in `coverage/` directory

### E2E Test Coverage

- **User Flows**: Complete user journeys
- **Cross-browser**: Chrome, Firefox, Safari
- **Mobile**: Responsive design testing
- **Accessibility**: WCAG compliance

## Test Scenarios

### Unit Tests

#### ColorPalette Component
- ✅ Renders color palette section
- ✅ Displays master brand colors
- ✅ Shows color hex codes
- ✅ Allows copying color codes
- ✅ Shows sub-brand colors when toggled
- ✅ Displays usage guidelines

#### Header Component
- ✅ Renders header with logo and navigation
- ✅ Displays navigation links
- ✅ Shows mobile menu button
- ✅ Toggles mobile menu
- ✅ Has proper navigation links

#### VoiceTonePlayground Component
- ✅ Renders voice and tone playground
- ✅ Displays scenario dropdown
- ✅ Shows audience buttons
- ✅ Allows changing scenario/audience
- ✅ Displays good and bad examples
- ✅ Shows voice principles

#### AssetLibrary Component
- ✅ Renders asset library section
- ✅ Displays asset categories
- ✅ Shows item counts
- ✅ Expands categories
- ✅ Shows file formats and sizes
- ✅ Allows downloading assets

#### BrandComplianceChecker Component
- ✅ Renders compliance checker section
- ✅ Shows file upload and text input areas
- ✅ Disables check button when no input
- ✅ Enables check button when input provided
- ✅ Runs compliance check
- ✅ Displays guidelines

### E2E Tests

#### Homepage
- ✅ Displays hero section
- ✅ Shows call-to-action buttons
- ✅ Displays quick stats
- ✅ Shows all main sections
- ✅ Displays footer
- ✅ Is responsive on mobile/tablet

#### Navigation
- ✅ Displays header with logo and navigation
- ✅ Shows navigation links
- ✅ Navigates to sections
- ✅ Shows mobile menu on small screens
- ✅ Scrolls to sections smoothly

#### Color Palette
- ✅ Displays color palette section
- ✅ Shows master brand colors
- ✅ Displays color hex codes
- ✅ Allows copying color codes
- ✅ Shows sub-brand colors when toggled
- ✅ Displays usage guidelines

#### Voice & Tone Playground
- ✅ Displays voice and tone playground
- ✅ Shows scenario dropdown and audience buttons
- ✅ Allows changing scenario/audience
- ✅ Displays good and bad examples
- ✅ Shows voice principles
- ✅ Allows copying examples

#### Asset Library
- ✅ Displays asset library section
- ✅ Shows asset categories
- ✅ Expands categories to show items
- ✅ Shows file formats and sizes
- ✅ Allows downloading assets
- ✅ Displays version information

#### Brand Compliance Checker
- ✅ Displays compliance checker section
- ✅ Shows file upload and text input areas
- ✅ Handles file upload
- ✅ Runs compliance check with text input
- ✅ Displays compliance guidelines
- ✅ Shows empty state initially

#### Accessibility
- ✅ Has proper heading hierarchy
- ✅ Has proper alt text for images
- ✅ Has proper form labels
- ✅ Has proper button labels
- ✅ Has proper link text
- ✅ Is keyboard navigable
- ✅ Has proper ARIA labels
- ✅ Has proper focus management
- ✅ Has proper semantic HTML

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline with:

1. **Unit Tests**: Runs on every push/PR
2. **E2E Tests**: Runs on every push/PR
3. **Lighthouse**: Performance and accessibility testing
4. **Accessibility**: Dedicated accessibility testing

### Test Reports

- **Unit Test Coverage**: Available in `coverage/` directory
- **E2E Test Reports**: Available in `playwright-report/` directory
- **Lighthouse Reports**: Available in GitHub Actions artifacts

## Best Practices

### Unit Testing
- Test component behavior, not implementation details
- Use user-centric testing with React Testing Library
- Mock external dependencies
- Test error states and edge cases
- Maintain high test coverage

### E2E Testing
- Test complete user journeys
- Test across multiple browsers
- Test responsive design
- Test accessibility
- Use page object model for maintainability

### Accessibility Testing
- Test keyboard navigation
- Test screen reader compatibility
- Test color contrast
- Test focus management
- Test semantic HTML

## Debugging Tests

### Unit Tests
```bash
# Run specific test file
npm test ColorPalette.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests with debug output
npm test -- --detectOpenHandles
```

### E2E Tests
```bash
# Run specific test file
npx playwright test color-palette.spec.ts

# Run tests in debug mode
npx playwright test --debug

# Run tests with trace
npx playwright test --trace on
```

## Performance Testing

### Lighthouse CI
- Performance score: 80+ (warning threshold)
- Accessibility score: 90+ (error threshold)
- Best practices score: 80+ (warning threshold)
- SEO score: 80+ (warning threshold)

### Running Lighthouse
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun
```

## Maintenance

### Adding New Tests
1. Create test file in appropriate directory
2. Follow naming convention: `ComponentName.test.tsx` or `feature.spec.ts`
3. Write comprehensive test cases
4. Update this documentation

### Updating Tests
1. Update tests when components change
2. Maintain test coverage above 70%
3. Update E2E tests for new features
4. Keep accessibility tests current

### Test Data
- Use consistent test data
- Mock external APIs
- Use realistic test scenarios
- Clean up test data after tests

---

**Testing Status**: ✅ Complete  
**Coverage**: 70%+ unit tests, 100% E2E coverage  
**Last Updated**: December 2024
