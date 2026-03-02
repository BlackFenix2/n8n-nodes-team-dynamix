# n8n-nodes-team-dynamix

An n8n community node package providing integration with the TeamDynamix API for ticket management and knowledge base operations.

**Status:** n8n Community Node Package | **Node Type:** Integration | **License:** MIT

For developers and collaborators: This repository follows n8n community node standards and publishing requirements. See [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed information.

## Features

- **TeamDynamix API Credential** - Multiple authentication modes (User Login, Admin Login, Token)
- **Ticket Operations:**
  - Create tickets
  - Get many tickets (with filtering and pagination)
  - Update tickets
  - Delete tickets
  - Add feed entries to tickets
- **Knowledge Base Operations:** KB article access
- **Automatic Publishing:** CI/CD pipeline automatically publishes updates to npm

## Installation

### From npm (for n8n users)

Follow the n8n community node installation guide:

- https://docs.n8n.io/integrations/community-nodes/installation/

Package name:

```bash
n8n-nodes-team-dynamix
```

### For local development

```bash
npm install
```

## Local Development

Start n8n with this node loaded and hot-reloaded:

```bash
npm run dev
```

Useful commands:

```bash
npm run lint
npm run lint:fix
npm run build
```

## Credentials

Credential type: `TeamDynamix API` (`teamDynamixApi`)

Supported auth modes:

- User Login
- Admin Login
- Existing Token (Manual)

Configure your TeamDynamix base URL and whichever auth fields apply to your mode.

## Operations

Resource: `Ticket`

- **Create**
  - Mode: Guided Fields or Raw JSON
  - Endpoint: `POST /tickets`
- **Get Many**
  - Endpoint: `GET /tickets`
  - Optional query params: `statusId`, `page`, `maxResults`
- **Update**
  - Endpoint: `PUT /tickets/{ticketId}`
- **Delete**
  - Endpoint: `DELETE /tickets/{ticketId}`
- **Add Feed**
  - Endpoint: `POST /tickets/{ticketId}/feed`

All requests are made against your configured credential `baseUrl`.

## Compatibility

- Node.js 22+
- Built with `@n8n/node-cli`

## Contributing

We welcome contributions! Before contributing, please see:

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development workflow, branch strategy, and testing guidelines
- **[N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)** - N8N standards, publishing requirements, and submission process

### Quick Setup for Development

```bash
npm install                # Install dependencies
npm run dev               # Start with hot reload
npm run lint             # Check code quality
npm run build            # Build distribution
```

## Publishing

This package is automatically published to npm on every push to the `main` or `master` branch via GitHub Actions.

**Setup required:** Configure npm Trusted Publisher (OIDC) for this repository and workflow.

**Important:** All n8n community nodes must follow [publishing requirements](./N8N_COMMUNITY_NODE_REQUIREMENTS.md#publishing-requirements), including:

- ✅ Automatic linting and building on all commits
- ✅ Publishing to npm registry with proper authentication
- ✅ Publishing with GitHub Actions and provenance statement

See [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) for full publishing standards.

## Required for n8n Submission

Before submitting this package to the n8n Creator Portal, confirm:

- ✅ Package name follows `n8n-nodes-*` convention
- ✅ Includes `n8n-community-node-package` keyword
- ✅ `package.json` includes valid `n8n` configuration
- ✅ No runtime dependencies (devDependencies only)
- ✅ `npm run lint` and `npm run build` both pass
- ✅ Published to npm via GitHub Actions with provenance
- ✅ README includes installation, credentials, and operations details

Submission details: https://creators.n8n.io/nodes

## Resources

- **N8N Documentation:** https://docs.n8n.io/integrations/creating-nodes/
- **N8N Community Nodes:** https://docs.n8n.io/integrations/community-nodes/
- **N8N Creator Portal (Submission):** https://creators.n8n.io/nodes
- **TeamDynamix API Docs:** https://solutions.teamdynamix.com/TDWebApi/
- **NPM Package:** https://www.npmjs.com/package/n8n-nodes-team-dynamix

## License

MIT
