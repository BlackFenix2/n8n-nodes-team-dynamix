## Purpose

Use these instructions when prompting Copilot to generate or update code for this repository's TeamDynamix n8n community node.

## Repo scope

- Package: `n8n-nodes-team-dynamix`
- Language: TypeScript
- Tooling: `@n8n/node-cli`
- Credential file: `credentials/TeamDynamixApi.credentials.ts`
- Node files: `nodes/TeamDynamix/*`

## API source of truth

- TeamDynamix API documentation: https://solutions.teamdynamix.com/TDWebApi/
- When generating endpoints, request bodies, or query params, validate against the docs above first.
- If endpoint behavior is unclear or differs by tenant/app context, call this out explicitly in the generated answer.

## Standards for generated code

- Follow n8n community node conventions and keep code strict TypeScript-compatible.
- Import n8n types from `n8n-workflow` and execution helpers from `n8n-core` when needed.
- Keep credential name and node `credentials` references aligned (`teamDynamixApi`).
- Avoid hard-coded secrets and never log full tokens.
- Prefer minimal, focused operations (MVP first), then expand.

## TeamDynamix-specific guidance

- Use the credential-provided `baseUrl` and bearer token auth.
- Build API URLs relative to the base URL, trimming trailing slashes.
- Ticket endpoints are app-scoped; include `/{appId}` in URL paths for ticket methods.
- Support app ID selection from either credential default or per-node override.
- For ticket list/search operations, use `POST /{appId}/tickets/search` with a `TicketSearch` JSON request body.
- Prefer API field names and payload shapes exactly as documented in TeamDynamix docs.

## Prompt templates

1. Add ticket list operation (recommended)

"Create `nodes/TeamDynamix/TeamDynamix.node.ts` implementing an n8n node named TeamDynamix with one resource `ticket` and one operation `getAll`. Add a required numeric `appId` parameter. Use credential `teamDynamixApi` and `this.helpers.httpRequestWithAuthentication` to call `POST {{$credentials.baseUrl}}/{{$parameter.appId}}/tickets/search` with a JSON `TicketSearch` body. Return one item per ticket. Validate endpoint and body shape against https://solutions.teamdynamix.com/TDWebApi/ and follow strict TypeScript and n8n node patterns."

2. Add ticket-by-id operation

"Extend `nodes/TeamDynamix/TeamDynamix.node.ts` with a `get` operation that accepts required `appId` and `ticketId`, and calls `GET /{appId}/tickets/{ticketId}` using `teamDynamixApi`. Validate request/response assumptions against https://solutions.teamdynamix.com/TDWebApi/. Keep operation routing clean and strongly typed."

3. Update credential safely

"Update `credentials/TeamDynamixApi.credentials.ts` so authentication and any pre-authentication logic use existing credential property names only. Keep Authorization header as `Bearer {{$credentials?.token}}` for manual token mode."

## Quality checklist

- `npm run build` passes.
- `npm run lint` passes or only reports pre-existing issues.
- Node is registered in `package.json` under `n8n.nodes`.
- Credential is registered in `package.json` under `n8n.credentials`.

## Local workflow

- Install: `npm install`
- Build: `npm run build`
- Lint: `npm run lint`
- Dev server: `npm run dev`

Use this file as guardrails so generated code stays consistent with n8n and this TeamDynamix package.
