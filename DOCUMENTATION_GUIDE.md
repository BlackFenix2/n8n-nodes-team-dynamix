# Repository Documentation Guide

This guide helps collaborators, copilots, and other tools quickly find the documentation they need.

---

## Quick Navigation

### 🚀 **I want to...**

#### ...get started contributing code

→ Start with [CONTRIBUTING.md](./CONTRIBUTING.md)

- Development setup
- Branch workflow
- Testing locally
- Troubleshooting

#### ...understand N8N community node requirements

→ Read [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)

- Package standards
- Publishing requirements
- N8N submission process
- Technical guidelines

#### ...set up Azure DevOps for npm publishing

→ Follow [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)

- Create npm token
- Configure service connection
- Verify pipeline configuration
- Troubleshooting publishing issues

#### ...understand what this package does

→ Read [README.md](./README.md)

- Features overview
- Installation instructions
- Credential setup
- Available operations

#### ...verify the package is ready to publish

→ Check [PUBLISH_READINESS_CHECKLIST.md](./PUBLISH_READINESS_CHECKLIST.md)

- Build & compile verification
- Code quality checks
- Package configuration validation
- Dry-run testing with `npm publish --dry-run`
- Pre-publish checklist

---

## Documentation Map

| File                                                                       | Purpose                           | Audience                         |
| -------------------------------------------------------------------------- | --------------------------------- | -------------------------------- |
| [README.md](./README.md)                                                   | Package overview & installation   | End users, new contributors      |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                       | Development workflow & guidelines | Developers, collaborators        |
| [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) | N8N standards & requirements      | All contributors, other copilots |
| [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)                           | Azure DevOps npm publishing setup | Project leads, DevOps engineers  |
| [PUBLISH_READINESS_CHECKLIST.md](./PUBLISH_READINESS_CHECKLIST.md)         | Pre-publish verification          | Release managers, before publish |
| [CHANGELOG.md](./CHANGELOG.md)                                             | Release history & version notes   | Release managers                 |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)                                 | Community guidelines              | All community members            |

---

## For Different Roles

### 👤 **New Developer**

1. Read: [README.md](./README.md) (features & architecture)
2. Read: [CONTRIBUTING.md](./CONTRIBUTING.md) (development setup)
3. Run: `npm install && npm run dev`

### 👥 **Code Reviewer**

1. Reference: [CONTRIBUTING.md](./CONTRIBUTING.md#code-standards) (code standards)
2. Reference: [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) (requirements)
3. Check: PR follows standards

### 🤖 **AI Copilot / Other Tools**

1. Read: [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) - **CRITICAL** for understanding this as an n8n community node
2. Reference: [CONTRIBUTING.md](./CONTRIBUTING.md) - Code standards & development workflow
3. Reference: [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md) - Publishing pipeline

### 🚀 **DevOps / Project Lead**

1. Read: [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md) (complete setup guide)
2. Reference: [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md#publishing-requirements) (standards)
3. Configure: npm service connection in Azure DevOps

---

## Key Concepts for Copilots

### This is NOT a Regular NPM Package

This repository is an **n8n community node package** with specific requirements:

- ✅ Must follow [n8n standards](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)
- ✅ Must publish to npm with proper authentication
- ⚠️ Must use [GitHub Actions OR Azure Pipelines with provenance](./N8N_COMMUNITY_NODE_REQUIREMENTS.md#github-actions-with-provenance-statement-%EF%B8%8F-critical) (May 1st, 2026+)
- ✅ Will be submitted to [N8N Creator Portal](https://creators.n8n.io/nodes) for verification

### Publishing Pipeline

```
Code pushed to main/master
        ↓
Azure Pipeline auto-triggers
        ↓
Lint + Build checks
        ↓
If successful → npm publish (automatic)
        ↓
Available on npm immediately
```

**Setup required:** See [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)

---

## Important Dates & Deadlines

- **Current Date:** February 26, 2026
- **Critical Deadline:** May 1st, 2026
  - All n8n community nodes MUST publish using GitHub Actions OR Azure Pipelines with npm provenance
  - See [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md#github-actions-with-provenance-statement-%EF%B8%8F-critical)

---

## Checklist for New Contributors

Before first commit:

- [ ] Read [README.md](./README.md)
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ ] Run `npm install && npm run dev`
- [ ] Verify node appears in local n8n
- [ ] Run `npm run lint` and `npm run build`
- [ ] Create feature branch (don't commit to main)
- [ ] Reference [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) for standards

---

## FAQ

**Q: Will copilots see this documentation?**
A: Yes. This repo includes comprehensive documentation that any AI tool reading the codebase will find. Start with [README.md](./README.md) linking to other docs.

**Q: What setup is needed in Azure DevOps?**
A: Complete step-by-step guide in [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md). Key steps:

1. Create npm token
2. Add Azure DevOps npm service connection
3. Configure Azure Pipeline (already in place)

**Q: Why all this documentation?**
A: n8n community nodes have [strict standards](./N8N_COMMUNITY_NODE_REQUIREMENTS.md). This documentation ensures everyone understands the requirements and can publish correctly.

**Q: When will this be published?**
A: After setup completes in Azure DevOps, it publishes automatically on every push to `main`/`master`.

---

## Support

For questions:

- **Development:** See [CONTRIBUTING.md](./CONTRIBUTING.md#troubleshooting)
- **Azure/Publishing:** See [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md#troubleshooting)
- **N8N Standards:** See [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)
- **General:** See [README.md](./README.md#resources)

---

## Updating This Guide

As the repository evolves, keep this guide updated:

- Add new documentation files here
- Update deadlines if changed
- Update role descriptions as needed
