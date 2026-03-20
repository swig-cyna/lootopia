import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
import { $hunt, $huntPoint } from "@lootopia/db/repositories/hunt.repository"
import * as StatusCodes from "stoker/http-status-codes"

import type {
  createHuntRoute,
  deleteHuntPointRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
} from "@lootopia/api/routes/hunts/doc"

export const createHuntController: RouteHandler<
  typeof createHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { title, description, points } = req.valid("json")

  const hunt = await $hunt.create({
    title,
    description,
    organizerId: user.id,
  })
  const huntPoints = await $huntPoint.create(
    points.map((point) => ({ ...point, huntId: hunt.id })),
  )

  return json({ ...hunt, points: huntPoints }, StatusCodes.CREATED)
}

export const listHuntsController: RouteHandler<
  typeof listHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit } = req.valid("query")

  const [hunts, { count }] = await Promise.all([
    $hunt.findByOrganizer(user.id, page, limit),
    $hunt.countByOrganizer(user.id),
  ])

  const huntIds = hunts.map((hunt) => hunt.id)
  const huntPoints = await $huntPoint.findByHuntIds(huntIds)

  const huntsWithPoints = hunts.map((hunt) => ({
    ...hunt,
    points: huntPoints.filter((point) => point.huntId === hunt.id),
  }))

  return json(
    paginate(huntsWithPoints, Number(count), page, limit),
    StatusCodes.OK,
  )
}

export const getHuntController: RouteHandler<
  typeof getHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const hunt = await $hunt.findById(id)

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const huntPoints = await $huntPoint.findByHuntIds([hunt.id])

  return json({ ...hunt, points: huntPoints }, StatusCodes.OK)
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const { title, description, status, points } = req.valid("json")

  const hunt = await $hunt.update(id, { title, description, status })

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const updatedPoints = (
    await Promise.all(
      points?.map((point) => $huntPoint.update(point.id, point)) || [],
    )
  ).filter((point) => point !== undefined)

  return json({ ...hunt, points: updatedPoints }, StatusCodes.OK)
}

export const deleteHuntController: RouteHandler<
  typeof deleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $hunt.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}

export const deleteHuntPointController: RouteHandler<
  typeof deleteHuntPointRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $huntPoint.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}
