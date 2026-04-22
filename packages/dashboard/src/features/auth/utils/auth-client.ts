import { createClient } from "@lootopia/auth/client"

const authClient = createClient(
  import.meta.env.VITE_API_URL ?? "http://localhost:3000",
)

export default authClient
