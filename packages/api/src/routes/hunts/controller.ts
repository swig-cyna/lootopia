import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
import { $hunt } from "@lootopia/db/repositories/hunt.repository"
import * as StatusCodes from "stoker/http-status-codes"

import type {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
} from "@lootopia/api/routes/hunts/doc"

export const createHuntController: RouteHandler<
  typeof createHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const body = req.valid("json")

  const hunt = await $hunt.create({
    title: body.title,
    description: body.description,
    organizerId: user.id,
  })

  return json(hunt, StatusCodes.CREATED)
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

  return json(paginate(hunts, Number(count), page, limit), StatusCodes.OK)
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

  return json(hunt, StatusCodes.OK)
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const body = req.valid("json")

  const hunt = await $hunt.update(id, body)

  return json(hunt!, StatusCodes.OK)
}

export const deleteHuntController: RouteHandler<
  typeof deleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $hunt.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}
