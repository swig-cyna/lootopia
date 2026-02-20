import { db } from "@lootopia/db/index"
import type { HuntTable } from "@lootopia/db/models/hunt"
import type { Insertable, Selectable, Updateable } from "kysely"
import { sql } from "kysely"

export type Hunt = Selectable<HuntTable>
export type NewHunt = Insertable<HuntTable>
export type HuntUpdate = Updateable<HuntTable>

export const $hunt = {
  findById: (id: string) =>
    db.selectFrom("hunts").selectAll().where("id", "=", id).executeTakeFirst(),

  findByOrganizer: (organizerId: string, page: number, limit: number) =>
    db
      .selectFrom("hunts")
      .selectAll()
      .where("organizerId", "=", organizerId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit)
      .execute(),

  countByOrganizer: (organizerId: string) =>
    db
      .selectFrom("hunts")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizerId", "=", organizerId)
      .executeTakeFirstOrThrow(),

  create: (hunt: NewHunt) =>
    db
      .insertInto("hunts")
      .values(hunt)
      .returningAll()
      .executeTakeFirstOrThrow(),

  update: (id: string, hunt: HuntUpdate) =>
    db
      .updateTable("hunts")
      .set({ ...hunt, updatedAt: sql`NOW()` })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(),

  delete: (id: string) => db.deleteFrom("hunts").where("id", "=", id).execute(),
}
