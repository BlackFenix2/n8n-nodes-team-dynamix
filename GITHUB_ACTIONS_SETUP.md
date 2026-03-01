# GitHub Actions Setup for npm Publishing

This document explains how to configure this repository to publish to npm using GitHub Actions with provenance and npm Trusted Publishing (OIDC).

## Prerequisites

- GitHub repository admin access
- npm account with publish permissions for `n8n-nodes-team-dynamix`
- GitHub Actions enabled for the repository
- npm Trusted Publishing configured for this repository (see Step 1)

## Workflow Used by This Repository

Publishing is defined in `.github/workflows/publish.yml`.

On successful completion of the `CI` workflow for `main` (and on manual workflow dispatch), the workflow:

1. Installs dependencies (`npm ci`)
2. Runs lint (`npm run lint`)
3. Runs build (`npm run build`)
4. Publishes with provenance via OIDC (`npm publish --provenance --ignore-scripts`)

Authentication uses npm Trusted Publishing (OIDC) — no `NPM_TOKEN` secret is required.

## Step 1: Configure npm Trusted Publishing

This repository uses npm Trusted Publishing (OIDC) for passwordless, token-free authentication.

1. Sign in to [npmjs.com](https://www.npmjs.com) and open the `n8n-nodes-team-dynamix` package settings.
2. Under **Trusted Publishers**, click **Add a publisher**.
3. Fill in:
   - **Owner**: `BlackFenix2`
   - **Repository**: `n8n-nodes-team-dynamix`
   - **Workflow filename**: `publish.yml`
4. Save.

GitHub Actions will now exchange an OIDC token for a short-lived npm publish token automatically — no secrets to rotate.

Reference: https://docs.npmjs.com/trusted-publishers

## Step 2: Ensure Required Workflow Permissions

The workflow must include:

```yaml
permissions:
  contents: read
  id-token: write
```

`id-token: write` is required for the OIDC token exchange and to generate provenance statements.

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

- Confirm npm Trusted Publishing is configured for this repo and the `publish.yml` workflow file name matches exactly.
- Ensure the workflow has `id-token: write` permission.
- Verify the package name in `package.json` matches the npm package name.

### Package already exists

The version in `package.json` is already published. Increment version and retry.

### `prepublishOnly` blocks publish

This repository intentionally uses `--ignore-scripts` in CI publish. Lint/build checks already run before publish.