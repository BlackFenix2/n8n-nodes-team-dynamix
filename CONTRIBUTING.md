# Contributing to n8n-nodes-team-dynamix

Thank you for your interest in contributing to this n8n community node! This document provides guidelines for collaborators.

## Before You Start

Please read [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) to understand:

- N8N community node standards
- Publishing requirements including GitHub Actions/provenance
- Technical requirements and code quality standards

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Git

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd n8n-nodes-team-dynamix

# Install dependencies
npm install

# Start development with hot reload
npm run dev
```

## Development Workflow

### Branch Strategy

- `develop` is the integration branch for ongoing work.
- Feature/fix/docs branches should target `develop`.
- `main` is the release branch.
- Merge `develop` into `main` only when ready to publish.
- Publishing to npm is triggered from `main` via GitHub Actions.

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 2. Make Your Changes

Make sure to follow these guidelines:

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Follow the existing code style
- Add comments for complex logic

### 3. Run Quality Checks

Before committing:

```bash
# Fix linting issues automatically
npm run lint:fix

# Run the linter to check for remaining issues
npm run lint

# Build the project
npm run build

# Test locally in n8n
npm run dev
```

All of these must pass. The pipeline will enforce them anyway.

### 4. Testing

#### Local Testing in N8N

1. Start n8n with the dev node:

   ```bash
   npm run dev
   ```

2. n8n will start with this node loaded and hot-reloaded

3. Create a test workflow to verify your changes work

4. Check the browser console and n8n logs for errors

#### Manual Testing Checklist

- [ ] Credentials can be created/tested
- [ ] Node appears in node list
- [ ] All operations work with valid credentials
- [ ] Error handling works for invalid inputs
- [ ] Error messages are clear and helpful

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new operation for TeamDynamix"
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open a PR against the `develop` branch with:

- Clear title describing the change
- Description explaining what and why
- Reference any related issues
- List of testing performed

When preparing a release, open a PR from `develop` into `main`.

### 7. Code Review

- Address feedback from reviewers
- Re-run tests after changes
- Push updates to the same branch

## Project Structure

```
├── nodes/                      # Node definitions
│   └── TeamDynamix/
│       ├── TeamDynamix.node.ts # Main node file
│       ├── KbArticleOperations.ts
│       └── TicketOperations.ts
├── credentials/                # Credential types
│   └── TeamDynamixApi.credentials.ts
├── dist/                       # Compiled output (generated)
├── package.json               # Package metadata & n8n config
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # Linting configuration
├── .github/workflows/         # GitHub Actions workflows (CI + publish)
├── README.md                  # User documentation
└── N8N_COMMUNITY_NODE_REQUIREMENTS.md  # Requirements (this file)
```

## Modifying Operations

### Adding a New Operation

1. Create the operation in `nodes/TeamDynamix/YourOperations.ts`
2. Export it from the main node file
3. Add operation properties in `TeamDynamix.node.ts`
4. Test with real TeamDynamix API
5. Update README with the new operation
6. Lint and build: `npm run lint:fix && npm run build`

### Modifying Credentials

1. Update `credentials/TeamDynamixApi.credentials.ts`
2. Ensure backwards compatibility with existing credentials
3. Test authentication methods
4. Update README credential section
5. Lint and build

## Publishing

**IMPORTANT:** This repository is configured to automatically publish to npm on push to `main` or `master` branch.

**First-time setup:** See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) for GitHub Actions npm publishing configuration.

### What Happens on Push to Main

1. GitHub Actions publish workflow runs:
   - Installs dependencies
   - Runs linter
   - Builds the project
2. If all checks pass, automatically publishes to npm
3. New version becomes available on npm immediately

### Before Merging to Main

Ensure:

- ✅ All tests pass
- ✅ Linting passes (`npm run lint`)
- ✅ Builds successfully (`npm run build`)
- ✅ Code review completed
- ✅ Version number updated in `package.json` (if making a release)
- ✅ Changes documented in `README.md`
- ✅ Changelog updated (if doing a formal release)
- ✅ GitHub Actions npm credentials configured (see [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md))

## Versioning

Use [Semantic Versioning](https://semver.org/):

- `PATCH` version (0.1.1 → 0.1.2): Bug fixes, no new features
- `MINOR` version (0.1.0 → 0.2.0): New features, backwards compatible
- `MAJOR` version (1.0.0 → 2.0.0): Breaking changes

Update the version in `package.json`:

```json
{
	"version": "0.2.0"
}
```

## Code Standards

### TypeScript

- Use strict typing (`"strict": true` in tsconfig.json)
- Avoid `any` type; use proper types
- Export types that are used by consumers

### Name Conventions

- Classes: `PascalCase` (e.g., `TeamDynamixNode`)
- Functions: `camelCase` (e.g., `getTicketData`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Private members: prefix with `_` (e.g., `_privateMethod`)

### Documentation

- Add JSDoc comments for public functions
- Comment complex logic
- Keep README.md up to date with new operations

Example:

```typescript
/**
 * Fetches a ticket from TeamDynamix API
 * @param credentialData - Authenticated credential data
 * @param ticketId - ID of the ticket to fetch
 * @returns Promise<TicketData>
 */
async function getTicket(credentialData: ICredentialData, ticketId: string) {
	// Implementation
}
```

## Common Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run dev:verbose     # Start with verbose logging
npm run build:watch     # Watch for changes and rebuild

# Quality
npm run lint            # Check code quality
npm run lint:fix        # Auto-fix linting issues
npm run build           # Build distribution

```

## Troubleshooting

### Node not showing in n8n

- Run `npm run build` to compile TypeScript
- Check `dist/` folder exists
- Verify paths in `package.json` n8n config
- Restart n8n dev server

### Lint failures

```bash
npm run lint:fix    # Auto-fix most issues
npm run lint        # Check what remains
```

### Build errors

```bash
rm -rf dist         # Delete old build
npm run build       # Rebuild from scratch
npm run lint        # Check for errors
```

### CI/CD pipeline failed

- Check GitHub Actions logs
- Ensure your changes pass locally: `npm run lint && npm run build`
- Push fixes to your branch - pipeline will retry automatically

## Security

- Never commit credentials, tokens, or secrets
- Use `.gitignore` for sensitive files
- Follow npm security best practices
- Update dependencies regularly

## Questions or Issues?

- Check [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)
- Review [N8N Documentation](https://docs.n8n.io/integrations/creating-nodes/)
- Check existing issues on the repository
- Create a new issue with detailed information

## Code of Conduct

This project is part of the n8n community. Please be respectful, professional, and constructive in all interactions.

Thank you for contributing!
