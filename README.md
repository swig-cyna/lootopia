# Lootopia

Modern monorepo backend built with Hono, Kysely, Better Auth, and TypeScript.

## Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Hono + OpenAPI
- **Database**: PostgreSQL with Kysely
- **Storage**: RustFS (S3-compatible)
- **Auth**: Better Auth
- **Package Manager**: pnpm

## Prerequisites

- Node.js 24+
- pnpm 10+
- Docker & Docker Compose

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Setup environment:

```bash
cp .env.example .env
```

4. Generate auth secret:

```bash
pnpx @better-auth/cli secret
```

Copy the generated secret to `BETTER_AUTH_SECRET` in `.env`

5. Start Docker services:

```bash
docker compose up -d
```

6. Configure S3 access keys:
   - Open [http://localhost:9001](http://localhost:9001)
   - Login with credentials from `.env` (S3_USER / S3_PASSWORD)
   - Navigate to **Access Keys** in sidebar
   - Create new access key
   - Copy the keys to `S3_ACCESS_KEY` and `S3_SECRET_KEY` in `.env`

7. Create S3 bucket:

```bash
pnpm s3:create
```

8. Run database migrations:

```bash
pnpm kysely migrate:latest
```

9. Seed database (optional):

```bash
pnpm kysely seed:run
```

## Development

Start all services:

```bash
pnpm dev
```

Or start packages individually:

```bash
pnpm dev:api        # API only
pnpm dev:dashboard  # Dashboard only
pnpm dev:mobile     # Mobile only
```

### URLs

| Service                  | URL                                                                          | Audience            |
| ------------------------ | ---------------------------------------------------------------------------- | ------------------- |
| Dashboard                | [https://localhost:3001](https://localhost:3001)                             | Organizers / Admins |
| Mobile                   | [https://localhost:3002](https://localhost:3002)                             | Players             |
| API docs (via dashboard) | [https://localhost:3001/api/reference](https://localhost:3001/api/reference) | —                   |
| API docs (via mobile)    | [https://localhost:3002/api/reference](https://localhost:3002/api/reference) | —                   |

### HTTPS in development

Both frontends use a self-signed certificate (`@vitejs/plugin-basic-ssl`). Your browser will show a security warning on first access — **click "Advanced" → "Proceed anyway"** (or equivalent in your browser).

> HTTPS is required in development because browser APIs such as geolocation and camera access are only available on secure origins. Without it, these features are silently blocked by the browser.

## Documentation

| Guide                            | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| [docs/api/](docs/api/)           | API routes, services, mappers, auth middlewares    |
| [docs/frontend/](docs/frontend/) | Dashboard & Mobile — routing, data fetching, forms |
| [docs/db/](docs/db/)             | Kysely, repositories, migrations, query utilities  |
| [docs/auth/](docs/auth/)         | Better Auth — server config, client, roles         |
| [docs/common/](docs/common/)     | Shared constants, schemas, and types               |

## Scripts

- `pnpm dev` - Start all packages in dev mode
- `pnpm dev:api` - Start API only
- `pnpm build` - Build all packages
- `pnpm start` - Start all packages in production mode
- `pnpm kysely` - Run Kysely CLI commands
- `pnpm s3:create` - Create S3 bucket with policy
- `pnpm clean` - Remove all node_modules and dist folders

## Database

### Migrations

Create new migration:

```bash
pnpm kysely migrate:make migration_name
```

Run migrations:

```bash
pnpm kysely migrate:latest
```

### Seeds

Create new seed:

```bash
pnpm kysely seed:make seed_name
```

Run seeds:

```bash
pnpm kysely seed:run
```

## Docker Services

- PostgreSQL: `localhost:5432`
- RustFS Console: [http://localhost:9001](http://localhost:9001)
- RustFS API: `localhost:9000`

## Environment Variables

See [.env.example](.env.example) for all available variables.
