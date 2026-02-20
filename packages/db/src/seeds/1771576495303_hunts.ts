import type { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
  const organizer = await db
    .selectFrom("user")
    .select(["id", "name"])
    .where("email", "=", "organizer@example.com")
    .executeTakeFirst()

  if (!organizer) {
    console.log("Organizer not found, skipping hunts seed")

    
return
  }

  const hunts = [
    {
      title: "Old Harbor Treasure Hunt",
      description: "Explore the historic alleys of the old harbor and solve riddles to find the hidden treasure.",
      status: "draft",
      organizerId: organizer.id,
    },
    {
      title: "Central Park Mysteries",
      description: "An outdoor adventure through the central park with AR points and nature-themed quizzes.",
      status: "published",
      organizerId: organizer.id,
    },
  ]

  const results = await Promise.allSettled(
    hunts.map((hunt) =>
      db.insertInto("hunts").values(hunt).executeTakeFirstOrThrow(),
    ),
  )

  results.forEach((result, index) => {
    const hunt = hunts[index]

    if (result.status === "fulfilled") {
      console.log(`Hunt "${hunt.title}" created for ${organizer.name}`)

      
return
    }

    console.log(`Hunt "${hunt.title}" already exists or failed`)
  })
}
