# E2E Tests for n8n-nodes-team-dynamix

This directory contains end-to-end tests for the TeamDynamix n8n node using Playwright.

## Setup

1. Install Playwright browsers:

   ```bash
   npm run test:install
   ```

2. Make sure Docker is running (tests use Docker Compose to start n8n)

## Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug
```

## Test Structure

- `workflow-creation.spec.js` - Tests for creating workflows with manual triggers and TeamDynamix nodes
  - Basic workflow creation with manual trigger
  - TeamDynamix node configuration
  - Guided search mode validation

## Writing New Tests

1. Create a new `.spec.js` file in this directory
2. Import Playwright test utilities: `import { test, expect } from '@playwright/test';`
3. Use the n8n UI selectors (data-test-id attributes when available)
4. Take screenshots for visual verification: `await page.screenshot({ path: 'tests/e2e/screenshots/test-name.png' });`

## Configuration

See `playwright.config.js` in the project root for configuration options.

## CI/CD

Tests are configured to run in GitHub Actions with:

- Chromium browser only (for speed)
- 2 retries on failure
- HTML reports published as artifacts
