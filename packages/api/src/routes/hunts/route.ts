import { OpenAPIHono } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"

import {
  createHuntController,
  deleteHuntController,
  getHuntController,
  listHuntsController,
  updateHuntController,
} from "@lootopia/api/routes/hunts/controller"
import {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
} from "@lootopia/api/routes/hunts/doc"

const huntsRouter = new OpenAPIHono<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .openapi(getHuntRoute, getHuntController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)

export default huntsRouter
