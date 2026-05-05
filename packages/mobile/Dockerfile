FROM node:24-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/dashboard/package.json ./packages/dashboard/
COPY packages/mobile/package.json ./packages/mobile/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @lootopia/mobile build

FROM nginx:alpine

COPY --from=builder /app/packages/mobile/dist /usr/share/nginx/html
COPY packages/mobile/nginx.conf /etc/nginx/conf.d/default.conf
