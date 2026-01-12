import type { Database } from "@lootopia/api/db/schema.ts"
import env from "@lootopia/api/env"
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely"
import pg from "pg"

const { Pool } = pg

export const dialect = new PostgresDialect({
  pool: new Pool({
    user: env.POSTGRES_USER,
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    port: Number(env.POSTGRES_PORT),
  }),
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()],
})
