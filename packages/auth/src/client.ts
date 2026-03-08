import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const createClient = (baseURL: string) =>
  createAuthClient({
    baseURL,
    basePath: "/auth",
    plugins: [adminClient()],
  })

export type AuthClient = ReturnType<typeof createClient>
