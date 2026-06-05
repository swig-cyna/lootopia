import { ac, roles } from "@lootopia/auth/permissions"
import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const createClient = (baseURL: string) =>
  createAuthClient({
    baseURL,
    basePath: "/api/auth",
    plugins: [adminClient({ ac, roles })],
  })

export type AuthClient = ReturnType<typeof createClient>
