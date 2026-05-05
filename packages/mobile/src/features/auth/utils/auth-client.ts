import { createClient } from "@lootopia/auth/client"

const authClient = createClient(window.location.origin)

export default authClient
