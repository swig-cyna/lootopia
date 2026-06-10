import { randomBytes, randomUUID, scrypt } from "crypto"
import type { Kysely } from "kysely"
import type { Database } from "@lootopia/db/schema"

const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex")
    scrypt(
      password.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => {
        if (err) {
          reject(err)
        }

        resolve(`${salt}:${key.toString("hex")}`)
      },
    )
  })

type SeedUser = {
  email: string
  password: string
  name: string
  role: string
}

async function createUser(
  db: Kysely<Database>,
  { email, password, name, role }: SeedUser,
) {
  const userId = randomUUID()
  const accountId = randomUUID()
  const hashedPassword = await hashPassword(password)
  const now = new Date()

  await db
    .insertInto("user")
    .values({
      id: userId,
      name,
      email,
      role,
      emailVerified: false,
      image: null,
      bio: null,
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: now,
      updatedAt: now,
    })
    .executeTakeFirstOrThrow()

  await db
    .insertInto("account")
    .values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      createdAt: now,
      updatedAt: now,
    })
    .executeTakeFirstOrThrow()
}

export async function seed(db: Kysely<Database>): Promise<void> {
  const users: SeedUser[] = [
    {
      email: "admin@example.com",
      password: "123456789",
      name: "Admin",
      role: "admin",
    },
    {
      email: "organizer@example.com",
      password: "123456789",
      name: "Organizer",
      role: "organizer",
    },
    {
      email: "player@example.com",
      password: "123456789",
      name: "Player",
      role: "player",
    },
  ]

  const results = await Promise.allSettled(
    users.map((user) => createUser(db, user)),
  )

  results.forEach((result, index) => {
    const user = users[index]

    if (result.status === "fulfilled") {
      console.log(`${user.name} created: ${user.email}`)

      return
    }

    console.log(`${user.name} already exists`)
  })
}
