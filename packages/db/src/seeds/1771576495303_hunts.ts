import type { Kysely } from "kysely"

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)

type HuntPointInsert = {
  huntId: string
  latitude: number
  longitude: number
  position: number
  gameType: "quiz" | "ar"
  arId: string | null
}

type QuizQuestionInsert = {
  huntPointId: string
  question: string
  answers: string
  correctAnswerIndex: number
}

type HuntConfig = {
  hunt: {
    title: string
    description: string
    status: string
    createdAt: Date
    updatedAt: Date
  }
  points: Omit<HuntPointInsert, "huntId">[]
  quizQuestions: Record<
    number,
    { question: string; answers: string[]; correctAnswerIndex: number }
  >
  reward: { topX: number; promoCode: string }
}

type HuntSeedData = Omit<HuntConfig, "hunt"> & {
  hunt: HuntConfig["hunt"] & { organizerId: string }
}

const HUNTS: HuntConfig[] = [
  {
    hunt: {
      title: "Chasse au trésor du Vieux-Port",
      description:
        "Explorez les ruelles historiques du Vieux-Port de Marseille et résolvez des énigmes pour découvrir le trésor caché.",
      status: "draft",
      createdAt: daysAgo(30),
      updatedAt: daysAgo(25),
    },
    points: [
      {
        position: 1,
        latitude: 43.2965,
        longitude: 5.3698,
        gameType: "quiz",
        arId: null,
      },
      {
        position: 2,
        latitude: 43.296,
        longitude: 5.372,
        gameType: "ar",
        arId: "balloons",
      },
      {
        position: 3,
        latitude: 43.2975,
        longitude: 5.371,
        gameType: "quiz",
        arId: null,
      },
    ],
    quizQuestions: {
      1: {
        question: "Quel est l'âge approximatif de la ville de Marseille ?",
        answers: ["1 000 ans", "2 000 ans", "2 600 ans", "3 500 ans"],
        correctAnswerIndex: 2,
      },
      3: {
        question:
          "Quelle est l'église emblématique qui domine Marseille depuis la colline ?",
        answers: [
          "Cathédrale de la Major",
          "Notre-Dame de la Garde",
          "Abbaye Saint-Victor",
          "Saint-Charles",
        ],
        correctAnswerIndex: 1,
      },
    },
    reward: { topX: 3, promoCode: "VIEUXPORT2026" },
  },
  {
    hunt: {
      title: "Mystères du Louvre",
      description:
        "Partez à la découverte des secrets du plus grand musée du monde à travers des jeux AR et des quiz sur l'art et l'histoire.",
      status: "published",
      createdAt: daysAgo(15),
      updatedAt: daysAgo(5),
    },
    points: [
      {
        position: 1,
        latitude: 48.8606,
        longitude: 2.3376,
        gameType: "quiz",
        arId: null,
      },
      {
        position: 2,
        latitude: 48.8613,
        longitude: 2.3354,
        gameType: "ar",
        arId: "balloons",
      },
      {
        position: 3,
        latitude: 48.8598,
        longitude: 2.3362,
        gameType: "quiz",
        arId: null,
      },
      {
        position: 4,
        latitude: 48.8619,
        longitude: 2.3385,
        gameType: "quiz",
        arId: null,
      },
    ],
    quizQuestions: {
      1: {
        question:
          "En quelle année le palais du Louvre est-il devenu un musée ?",
        answers: ["1789", "1793", "1804", "1815"],
        correctAnswerIndex: 1,
      },
      3: {
        question: "Quelle est la mesure de la base de la Pyramide du Louvre ?",
        answers: ["20 mètres", "35 mètres", "55 mètres", "70 mètres"],
        correctAnswerIndex: 1,
      },
      4: {
        question: "Combien d'œuvres environ sont exposées au musée du Louvre ?",
        answers: ["5 000", "15 000", "35 000", "80 000"],
        correctAnswerIndex: 2,
      },
    },
    reward: { topX: 5, promoCode: "LOUVRE2026" },
  },
  {
    hunt: {
      title: "Les Secrets de Montmartre",
      description:
        "Remontez le temps dans les ruelles pavées de Montmartre, entre artistes légendaires et monuments emblématiques.",
      status: "published",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
    },
    points: [
      {
        position: 1,
        latitude: 48.8867,
        longitude: 2.3431,
        gameType: "quiz",
        arId: null,
      },
      {
        position: 2,
        latitude: 48.8861,
        longitude: 2.341,
        gameType: "ar",
        arId: "balloons",
      },
      {
        position: 3,
        latitude: 48.8854,
        longitude: 2.3448,
        gameType: "quiz",
        arId: null,
      },
    ],
    quizQuestions: {
      1: {
        question:
          "Quand a débuté la construction de la basilique du Sacré-Cœur ?",
        answers: ["1856", "1875", "1890", "1904"],
        correctAnswerIndex: 1,
      },
      3: {
        question:
          "Quel artiste a installé son atelier au Bateau-Lavoir à Montmartre ?",
        answers: ["Monet", "Picasso", "Renoir", "Degas"],
        correctAnswerIndex: 1,
      },
    },
    reward: { topX: 4, promoCode: "MONTMARTRE2026" },
  },
]

async function createHunt(
  db: Kysely<any>,
  data: HuntSeedData,
): Promise<{ id: string; title: string; status: string } | undefined> {
  const { hunt, points, quizQuestions, reward } = data

  const existing = await db
    .selectFrom("hunts")
    .select("id")
    .where("title", "=", hunt.title)
    .executeTakeFirst()

  if (existing) {
    console.log(`Hunt "${hunt.title}" already exists, skipping`)

    return undefined
  }

  const createdHunt = await db
    .insertInto("hunts")
    .values(hunt)
    .returningAll()
    .executeTakeFirstOrThrow()

  const createdPoints = await db
    .insertInto("hunt_points")
    .values(points.map((p) => ({ ...p, huntId: createdHunt.id })))
    .returningAll()
    .execute()

  const questionsToInsert: QuizQuestionInsert[] = Object.entries(
    quizQuestions,
  ).flatMap(([positionStr, q]) => {
    const position = Number(positionStr)
    const point = createdPoints.find((p) => p.position === position)

    if (!point) {
      return []
    }

    return [
      {
        huntPointId: point.id,
        question: q.question,
        answers: JSON.stringify(q.answers),
        correctAnswerIndex: q.correctAnswerIndex,
      },
    ]
  })

  if (questionsToInsert.length > 0) {
    await db.insertInto("quiz_questions").values(questionsToInsert).execute()
  }

  await db
    .insertInto("hunt_rewards")
    .values({ huntId: createdHunt.id, ...reward })
    .execute()

  console.log(
    `Hunt "${createdHunt.title}" created with ${createdPoints.length} points`,
  )

  return {
    id: createdHunt.id,
    title: createdHunt.title,
    status: createdHunt.status,
  }
}

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

  const hunts: HuntSeedData[] = HUNTS.map((config) => ({
    ...config,
    hunt: { ...config.hunt, organizerId: organizer.id },
  }))

  const createdHunts = await Promise.all(
    hunts.map((huntData) => createHunt(db, huntData)),
  )

  const player = await db
    .selectFrom("user")
    .select("id")
    .where("email", "=", "player@example.com")
    .executeTakeFirst()

  if (!player) {
    return
  }

  const publishedHunt = createdHunts.find((h) => h?.status === "published")

  if (!publishedHunt) {
    return
  }

  const existingParticipation = await db
    .selectFrom("hunt_participations")
    .select("id")
    .where("huntId", "=", publishedHunt.id)
    .where("userId", "=", player.id)
    .executeTakeFirst()

  if (existingParticipation) {
    return
  }

  await db
    .insertInto("hunt_participations")
    .values({
      huntId: publishedHunt.id,
      userId: player.id,
      joinedAt: daysAgo(3),
    })
    .execute()

  console.log(`Player joined "${publishedHunt.title}"`)
}
