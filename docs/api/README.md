# API Documentation

Complete guide for developing with the API.

## Table of Contents

- [Creating Routes](creating-routes.md) — schema, doc, controller, route.ts
- [Services & Mappers](services.md) — `$$service` pattern, mappers, business logic layer
- [Ownership Middlewares](middlewares.md) — `requireHuntOwner`, extended context types
- [Pagination](pagination.md) — `paginationParamsSchema`, `paginateQuery`, `paginate`
- [Authentication & Authorization](authentication.md) — roles, `requireRoles`, `createAuthResponses`

## Quick Links

### Development

- API runs on [http://localhost:3001](http://localhost:3001)
- OpenAPI spec at [http://localhost:3001/doc](http://localhost:3001/doc)
- Scalar API explorer at [http://localhost:3001/reference](http://localhost:3001/reference)

### Route Structure

Every route follows this pattern:

```
packages/api/src/routes/your-route/
├── schema.ts        # Zod schemas (request + response)
├── doc.ts           # OpenAPI route definitions
├── controller.ts    # HTTP handlers — thin, delegates to service
├── route.ts         # Assembly: connects doc + controller + sub-routers
├── mappers.ts       # (optional) DB model → API response transformations
├── middlewares.ts   # (optional) route-specific middlewares & context types
└── sub-resource/    # (optional) sub-routes mounted in route.ts
```

### Key Concepts

#### Architecture

- `controller.ts` is thin — all business logic goes in a **service** (`src/services/`)
- DB repositories are called only from services, never from controllers
- **Mappers** transform DB models into API response shapes (hide sensitive fields, reshape data)

#### Authentication

- `requireAuth` — requires user to be authenticated (401 if not)
- `requireRoles([...])` — requires specific roles (403 if wrong role, admin bypasses all)
- `createAuthResponses()` — auto-adds 401/403 to OpenAPI spec for protected routes

#### Roles (from `@lootopia/auth/constants`)

- `ROLES.PLAYER` — Standard player
- `ROLES.ORGANIZER` — Organizer
- `ROLES.ADMIN` — Administrator (bypasses all role checks)

#### Request Validation

- Path params: `req.valid("param")`
- Query params: `req.valid("query")`
- Body: `req.valid("json")`

#### Status Codes

```typescript
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
```

Always use `StatusPhrases` for error message strings — never hardcode raw strings.

## Examples

### Basic Route

See [creating-routes.md](creating-routes.md) for complete examples.

### Protected Route

See [authentication.md](authentication.md) for authentication patterns.
