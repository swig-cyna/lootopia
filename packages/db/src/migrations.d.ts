import type { Migration } from "kysely"

declare module "migrations:all" {
  const migrations: Record<string, Migration>

  export default migrations
}
