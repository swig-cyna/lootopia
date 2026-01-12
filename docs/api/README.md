# API Documentation

Complete guide for developing with the API.

## Table of Contents

### Getting Started

- [Creating Routes](creating-routes.md) - Complete guide for creating new API endpoints
- [Authentication & Authorization](authentication.md) - Role-based access control and auth response helpers

## Quick Links

### Development

- API runs on [http://localhost:3001](http://localhost:3001)
- OpenAPI documentation at [http://localhost:3001/docs](http://localhost:3001/docs)

### Route Structure

Every route follows this pattern:

```
packages/api/src/routes/your-route/
├── schema.ts    # Zod validation schemas
├── doc.ts       # OpenAPI route definitions
└── route.ts     # Route handlers
```

### Key Concepts

#### Authentication

- `loggedInMiddleware` - Requires user to be authenticated
- `requireRoles([...])` - Requires specific roles
- Bearer token auth in OpenAPI: `security: [{ bearerAuth: [] }]`

#### Roles

- `ROLES.USER` - Standard user
- `ROLES.PARTNER` - Partner
- `ROLES.ADMIN` - Administrator (access to everything)

#### Request Validation

- Path params: `c.req.valid("param")`
- Query params: `c.req.valid("query")`
- Body: `c.req.valid("json")`

#### Status Codes

```typescript
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
```

## Examples

### Basic Route

See [creating-routes.md](creating-routes.md) for complete examples.

### Protected Route

See [authentication.md](authentication.md) for authentication patterns.
