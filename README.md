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

- Node.js 20+
- pnpm 9+
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
docker-compose up -d
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

Start API only:

```bash
pnpm dev:api
```

API will be available at [http://localhost:3001](http://localhost:3001)

API documentation at [http://localhost:3001/docs](http://localhost:3001/docs)

## Documentation

### API Documentation

Complete guides for API development: [docs/api/](docs/api/)

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
