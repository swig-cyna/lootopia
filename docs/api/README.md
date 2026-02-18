# API Documentation

Complete guide for developing with the API.

## Table of Contents

### Getting Started

- [Creating Routes](creating-routes.md) - Complete guide for creating new API endpoints
- [Authentication & Authorization](authentication.md) - Role-based access control and auth response helpers

## Quick Links

### Development

- API runs on [http://localhost:3001](http://localhost:3001)
- OpenAPI spec at [http://localhost:3001/doc](http://localhost:3001/doc)
- Scalar API explorer at [http://localhost:3001/reference](http://localhost:3001/reference)

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

- `requireAuth` - Requires user to be authenticated (401 if not)
- `requireRoles([...])` - Requires specific roles (403 if wrong role, admin bypasses all)
- `createAuthResponses()` - Auto-adds 401/403 to OpenAPI spec for protected routes

#### Roles (from `@lootopia/auth`)

- `ROLES.PLAYER` - Standard player
- `ROLES.ORGANIZER` - Organizer
- `ROLES.ADMIN` - Administrator (bypasses all role checks)

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
