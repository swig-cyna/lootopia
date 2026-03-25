import { createClient } from "@lootopia/auth/client"

const authClient = createClient(import.meta.env.VITE_API_BASE_URL)

export default authClient
