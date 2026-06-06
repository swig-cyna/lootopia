FROM node:24-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/

RUN pnpm install --frozen-lockfile

COPY packages/api ./packages/api
COPY packages/auth ./packages/auth
COPY packages/db ./packages/db
COPY packages/common ./packages/common

RUN pnpm --filter @lootopia/api build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/db/dist/migrate.cjs ./packages/db/dist/migrate.cjs
COPY packages/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
