# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the Smart Life Web App.

## Test Structure

```
tests/
├── setup.js                          # Global test setup and mocks
├── unit/                             # Unit tests
│   ├── components/                   # Component tests
│   │   └── AppLogo.test.js
│   ├── composables/                  # Composable tests
│   │   └── useTheme.test.js
│   ├── libs/                         # Library tests
│   │   └── tuya.test.js
│   ├── router/                       # Router tests
│   │   └── index.test.js
│   ├── views/                        # View tests
│   │   └── Home.test.js
│   └── App.test.js
└── integration/                      # Integration tests
    ├── api.test.js
    └── theme-persistence.test.js
```

## Running Tests

### Run all tests in watch mode
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run with coverage report
```bash
npm run test:coverage
```

### Run with UI
```bash
npm run test:ui
```

## Test Coverage

The test suite covers:

### Unit Tests
- ✅ **useTheme composable**: Theme switching, persistence, initialization
- ✅ **Tuya API library**: Login, device list, toggle, state queries
- ✅ **AppLogo component**: Rendering, attributes
- ✅ **Home view**: Login flow, device management, logout, icons
- ✅ **Router**: Route configuration
- ✅ **App component**: Root rendering

### Integration Tests
- ✅ **API flow**: Complete login to device control workflow
- ✅ **Theme persistence**: Cross-instance theme synchronization
- ✅ **Error handling**: Network and API error scenarios

## Mocks

### Global Mocks (setup.js)
- `localStorage`: Mocked for all tests
- `navigator.serviceWorker`: Mocked PWA functionality

### Module Mocks
- `@/libs/tuya`: Mocked in Home.vue tests to isolate component logic

## Best Practices

1. **Isolation**: Each test is independent and cleans up after itself
2. **Mocking**: External dependencies are mocked appropriately
3. **Coverage**: Aim for >80% code coverage on critical paths
4. **Snapshots**: Used sparingly for UI components
5. **Async handling**: Proper await usage for async operations

## Writing New Tests

When adding new features:

1. Create test file matching source structure
2. Import necessary testing utilities from vitest
3. Mock external dependencies
4. Test happy path and error cases
5. Run tests locally before committing

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pre-commit hooks (recommended)
- Before deployment

## Troubleshooting

### Tests failing after dependency update
```bash
npm install
rm -rf node_modules/.vite
npm run test:run
```

### Coverage not updating
```bash
rm -rf coverage/
npm run test:coverage
```
