import type { AppType } from "@lootopia/api/routes/route"
import { hc } from "hono/client"

const client = hc<AppType>("")
type Client = typeof client

const createClient = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args)

export const api = createClient(`${window.location.origin}/api`, {
  fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
    const res = await fetch(url, { ...options, credentials: "include" })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }

    return res
  },
})
