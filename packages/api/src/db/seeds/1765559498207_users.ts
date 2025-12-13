import { auth } from "@lootopia/api/lib/auth"
import { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  try {
    const admin = await auth.api.createUser({
      body: {
        email: "admin@example.com",
        password: "123456789",
        name: "Admin",
        role: "admin",
      },
    })

    console.log("Admin user created:", admin.user.id)
  } catch (error) {
    console.log("Admin user already exists")
  }

  try {
    const partner = await auth.api.createUser({
      body: {
        email: "partner@example.com",
        password: "123456789",
        name: "Partner",
        role: "partner" as any,
      },
    })

    console.log("Partner user created:", partner.user.id)
  } catch (error) {
    console.log("Partner user already exists")
  }

  try {
    const user = await auth.api.createUser({
      body: {
        email: "user@example.com",
        password: "123456789",
        name: "User",
        role: "user",
      },
    })

    console.log("User user created:", user.user.id)
  } catch (error) {
    console.log("User user already exists")
  }
}
