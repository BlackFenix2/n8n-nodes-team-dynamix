# GitHub Actions Setup for npm Publishing

This document explains how to configure this repository to publish to npm using GitHub Actions with provenance.

## Prerequisites

- GitHub repository admin access
- npm account with publish permissions for `n8n-nodes-team-dynamix`
- GitHub Actions enabled for the repository

## Workflow Used by This Repository

Publishing is defined in `.github/workflows/publish.yml`.

On successful completion of the `CI` workflow for `main` (and on manual workflow dispatch), the workflow:

1. Installs dependencies (`npm ci`)
2. Runs lint (`npm run lint`)
3. Runs build (`npm run build`)
4. Publishes with provenance (`npm publish --provenance --ignore-scripts`)

This ensures publish only runs after CI passes and publishes the exact commit CI validated.

## Step 1: Configure npm Authentication

### Option A: Use `NPM_TOKEN` secret (simple)

1. In npm, create an **automation** token (or a granular token with publish permissions).
2. In GitHub, open **Settings → Secrets and variables → Actions**.
3. Create repository secret: `NPM_TOKEN`.
4. Paste the token value.

### Option B: Use npm Trusted Publishing (recommended)

Set up npm trusted publishing for your GitHub repository/workflow so publishing can use OIDC without storing long-lived npm tokens.

Reference: https://docs.npmjs.com/trusted-publishers

## Step 2: Ensure Required Workflow Permissions

The workflow must include:

```yaml
permissions:
  contents: read
  id-token: write
```

`id-token: write` is required to generate provenance statements.

## Step 3: Release a New Version

1. Bump version in `package.json` (for example, `0.1.3` → `0.1.4`).
2. Commit and push to `main`.
3. Watch the `Publish` workflow in the Actions tab.

Verify release:

```bash
npm view n8n-nodes-team-dynamix version
```

## Troubleshooting

### 403 / auth errors

- Verify `NPM_TOKEN` exists and is valid
- Confirm token has publish permissions for the package
- If 2FA is enforced, prefer automation token or trusted publishing

### Package already exists

The version in `package.json` is already published. Increment version and retry.

### `prepublishOnly` blocks publish

This repository intentionally uses `--ignore-scripts` in CI publish. Lint/build checks already run before publish.