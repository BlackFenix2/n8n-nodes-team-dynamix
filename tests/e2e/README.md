# E2E Tests for n8n-nodes-team-dynamix

This directory contains end-to-end tests for the TeamDynamix n8n node using Playwright.

## Setup

1. Install Playwright browsers:

   ```bash
   npm run test:install
   ```

2. Make sure Docker is running (tests use Docker Compose to start n8n)

3. Create local test env values:

```bash
cp .env.example .env.local
```

Update `.env.local` with your local credentials used by E2E tests:

- `TDX_BASE_URL`
- `TDX_USERNAME`
- `TDX_PASSWORD`

## Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Recreate a fresh e2e container, then open Playwright UI
npm run docker:e2e:fresh:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with code generation (record UI interactions)
npm run test:codegen
```

## Test Structure

The test suite is organized into focused modules:

- **smoke-test.spec.ts** - Verifies n8n is accessible and responsive
  - Page load verification
- **auth.spec.ts** - Authentication and sign-in flows
  - Sign-in with test credentials
  - Verification of logged-in state

- **credentials.spec.ts** - TeamDynamix credential management
  - Creating API credentials
  - Credential form validation

- **ticket-operations.spec.ts** - Ticket resource operations
  - Creating workflows with Ticket nodes
  - Configuring Ticket Get Many with guided search
  - Testing various search modes

- **kb-article-operations.spec.ts** - KB Article resource operations
  - Creating workflows with KB Article nodes
  - Configuring KB Article Get Many with guided search

- **full-workflow-demo.spec.ts** - Full video walkthrough
  - Optional setup wizard completion
  - Sign in, credential creation, workflow + node configuration

## Shared Helpers

Common test utilities are available in **helpers.ts** and **env.ts**:

- `signIn(page)` - Sign in with test credentials
- `createNewWorkflow(page)` - Create a new workflow
- `addTeamDynamixNode(page)` - Add TeamDynamix node to canvas
- `openTeamDynamixNodeParams(page)` - Click to open node parameters
- `selectResource(page, resourceName)` - Select a resource (Ticket, KB Article)
- `selectOperation(page, operationName)` - Select an operation (Get Many, Create, etc.)
- `configureGuidedSearch(page)` - Configure guided search mode for queries
- `takeScreenshot(page, filename)` - Capture screenshot for verification

## Writing New Tests

1. Create a new `.spec.ts` file in this directory
2. Import Playwright and helper functions:

```typescript
import { test, expect } from '@playwright/test';
import { createNewWorkflow, addTeamDynamixNode } from './helpers';
import { e2eEnv } from './env';
```

3. Use helper functions and `e2eEnv` values instead of hardcoding credentials
4. Take screenshots for visual verification

## Configuration

See `playwright.config.ts` in the project root for configuration options.

## CI/CD

Tests are configured to run in GitHub Actions with:

- Chromium browser only (for speed)
- 2 retries on failure
- HTML reports published as artifacts
