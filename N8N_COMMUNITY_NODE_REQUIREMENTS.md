# N8N Community Node Package Requirements & Publishing Guidelines

This repository is an n8n community node package for TeamDynamix API. This document outlines the requirements, standards, and publishing guidelines that all n8n community nodes must follow.

**Reference**: [N8N Community Nodes - Build Community Nodes](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)

## Table of Contents

1. [Package Standards](#package-standards)
2. [Technical Requirements](#technical-requirements)
3. [Publishing Requirements](#publishing-requirements)
4. [Verification & Submission](#verification--submission)

---

## Package Standards

All n8n community node packages must adhere to the following standards:

### 1. Package Naming Convention ✅

- Package name **must** start with `n8n-nodes-` or `@<scope>/n8n-nodes-`
- Example: `n8n-nodes-team-dynamix` (this package)
- This is a strict requirement for n8n to discover and recognize your package

**Status in this repo:** ✅ COMPLIANT - Named `n8n-nodes-team-dynamix`

### 2. Package Keywords ✅

The `package.json` **must** include `n8n-community-node-package` in the keywords array.

This allows n8n and npm users to discover your node in search results.

**Current keywords:**

```json
"keywords": [
  "n8n-community-node-package",
  "Team Dynamix",
  "TDX",
  "API",
  "auth",
  "tickets"
]
```

**Status in this repo:** ✅ COMPLIANT

### 3. N8N Configuration in package.json ✅

The `package.json` must include an `n8n` object that declares:

- `n8nNodesApiVersion`: API version (currently 1)
- `strict`: Whether strict mode is enabled
- `credentials`: Array of credential file paths (compiled)
- `nodes`: Array of node file paths (compiled)

**Current configuration:**

```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "strict": true,
  "credentials": [
    "dist/credentials/TeamDynamixApi.credentials.js"
  ],
  "nodes": [
    "dist/nodes/TeamDynamix/TeamDynamix.node.js"
  ]
}
```

**Status in this repo:** ✅ COMPLIANT

### 4. Repository Metadata ✅

The `package.json` must include:

- `homepage`: Link to repository
- `repository`: Git repository details
- `publishConfig`: Public npm access configuration

**Status in this repo:** ✅ COMPLIANT - See `package.json`

---

## Technical Requirements

### 1. Code Quality & Linting ✅

All community nodes must pass the n8n linter to ensure code quality and consistency.

**Command:**

```bash
npm run lint
```

**Status in this repo:** ✅ COMPLIANT - Linting configured with n8n-node CLI

### 2. Code Standards

- Follow n8n UX guidelines for node UI/parameters
- No breaking changes without version bumps
- Proper error handling
- Clear, well-documented operations

**Reference:** [UX Guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/)

### 3. Runtime Dependencies ⚠️

**Critical:** Verified community nodes **cannot use any runtime dependencies**.

Only `devDependencies` are allowed. Runtime dependencies will cause rejection.

**Current status in this repo:** ✅ COMPLIANT - Only devDependencies present

### 4. Local Testing

All changes must be tested locally before publishing.

```bash
npm run dev          # Start with hot reload
npm run build        # Build distribution
npm run lint         # Check code quality
```

---

## Publishing Requirements

**See [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md) for step-by-step Azure DevOps configuration instructions.**

### 1. NPM Registry Publishing ✅

The package must be published to the [npm registry](https://www.npmjs.com/).

Publishing is configured in `package.json`:

```json
"publishConfig": {
  "access": "public",
  "registry": "https://registry.npmjs.org/"
}
```

**Status in this repo:** ✅ COMPLIANT

### 2. GitHub Actions with Provenance Statement ⚠️ **CRITICAL**

**IMPORTANT: Starting May 1st, 2026, all community nodes MUST be published using GitHub Actions with npm provenance support.**

This is a mandatory requirement for:

- New nodes being submitted
- Updated versions of existing nodes
- Continued compliance with n8n standards

#### What is Provenance?

Provenance statements are cryptographic proofs that your package was built and published by you. This protects npm users from supply chain attacks.

#### Current Environment

**⚠️ NOTE:** This repository currently uses **Azure Pipelines** for CI/CD. However, the `azure-pipelines.yml` has been updated with npm publishing support.

**For full n8n compliance (May 1st, 2026+), consider:**

- **Option 1 (Recommended):** Migrate to GitHub Actions
  - Create `.github/workflows/publish.yml`
  - Use `npm publish --provenance` (requires Node 19.6+)
  - Set up OIDC token provider for GitHub Actions in npm

- **Option 2:** Continue with Azure Pipelines
  - Azure Pipelines can provide OIDC tokens to npm
  - Configure npm service connection with OIDC
  - Update `azure-pipelines.yml` to use `npm publish --provenance`

#### GitHub Actions Example Workflow

If migrating to GitHub Actions, create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run lint
      - run: npm run build

      - run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Azure Pipelines with Provenance

If continuing with Azure Pipelines:

```yaml
- script: |
    npm publish --provenance
  displayName: 'Publish to npm with provenance'
  condition: and(succeeded(), or(eq(variables['Build.SourceBranch'], 'refs/heads/main'), eq(variables['Build.SourceBranch'], 'refs/heads/master')))
  env:
    NODE_AUTH_TOKEN: $(npm.token)
```

**Current status in this repo:** 🟡 PARTIAL - Azure Pipelines configured, but may need provenance flag

---

## Verification & Submission

### Pre-Submission Checklist

Before submitting your node for n8n verification, ensure:

- ✅ Package name follows `n8n-nodes-*` convention
- ✅ Includes `n8n-community-node-package` keyword
- ✅ Has proper `n8n` configuration in `package.json`
- ✅ Passes `npm run lint`
- ✅ Builds successfully with `npm run build`
- ✅ No runtime dependencies (only devDependencies)
- ✅ Follows UX guidelines
- ✅ Has comprehensive README with usage examples
- ✅ Published to npm registry
- ✅ Uses GitHub Actions OR Azure Pipelines with provenance support

### Submission Process

1. **Publish to npm** (if not auto-published by pipeline)

   ```bash
   npm publish
   ```

2. **Create detailed README** covering:
   - Installation instructions
   - Credential setup
   - Available operations
   - Usage examples
   - Compatibility information

3. **Sign in/up to n8n Creator Portal**
   - Visit: https://creators.n8n.io/nodes

4. **Submit your node for verification**
   - Provide package name: `n8n-nodes-team-dynamix`
   - npm URL: `https://www.npmjs.com/package/n8n-nodes-team-dynamix`
   - Repository URL (Azure DevOps)

5. **Wait for n8n review**
   - n8n will verify technical and UX standards
   - May request changes before approval
   - Once approved, node appears in n8n installations

### Important Considerations

- **Enterprise features:** N8N reserves the right to reject nodes that compete with paid/enterprise n8n features
- **Code quality:** Linting and build must pass
- **Documentation:** Clear, well-written README helps approval chances
- **Testing:** Provide examples that demonstrate functionality

**Reference:** [Submit Community Nodes](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)

---

## Development Workflow for Collaborators

### Branch Structure

- `main` / `master`: Production-ready code
  - Automatically publishes to npm on push
  - Should be protected branch requiring reviews
- `develop`: Feature development
  - Pull requests merge here first
  - Then create PR to main for release

### Making Changes

1. Create feature branch from `develop`

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes

   ```bash
   npm run lint:fix
   npm run build
   npm run dev
   ```

3. Test thoroughly

   ```bash
   npm run lint
   npm run build
   ```

4. Create pull request to `develop`

5. After review, merge to `main` for publication

### Versioning

Use [semantic versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH` (e.g., 0.1.1)
- PATCH: Bug fixes
- MINOR: New features (backwards compatible)
- MAJOR: Breaking changes

Update version in `package.json` before merging to `main`:

```json
"version": "0.2.0"
```

The CI/CD pipeline will automatically publish the new version to npm.

---

## Resources

- **Azure DevOps Setup:** [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md) - Step-by-step configuration for npm publishing
- **N8N Docs:** https://docs.n8n.io/integrations/creating-nodes/
- **Community Nodes Guide:** https://docs.n8n.io/integrations/community-nodes/
- **N8N Creator Portal:** https://creators.n8n.io/nodes
- **NPM Provenance:** https://docs.npmjs.com/generating-provenance-statements
- **npm Tokens:** https://docs.npmjs.com/creating-and-viewing-authentication-tokens
- **Azure DevOps Service Connections:** https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints

---

## Questions or Issues?

For n8n-specific questions: https://docs.n8n.io/integrations/creating-nodes/test/troubleshooting-node-development/

For npm/publishing questions: https://docs.npmjs.com/

For this specific package: See [CONTRIBUTING](./CONTRIBUTING.md) or [README](./README.md)
