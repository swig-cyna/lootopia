## Quick Setup

- Copy `.env.example` to `.env`
- Generate better auth secret with `pnpx @better-auth/cli secret` and set it in `.env`
- Install dependencies with `pnpm i`
- Create containers with `docker-compose up -d`
- Go to [http://localhost:9001](http://localhost:9001) and login with credentials from `.env` and click on sidebar **Access Keys** and create a new one and copy it to `.env`
- Create S3 bucket with `pnpm s3:create` for creating a new bucket with setup policy
- Migrate database with `pnpm kysely migrate:latest --experimental-resolve-tsconfig-paths`
- Start dev server with `pnpm dev`
