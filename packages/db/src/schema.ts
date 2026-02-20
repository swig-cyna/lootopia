import type {
  HuntPointTable,
  HuntRewardTable,
  HuntTable,
  QuizQuestionTable,
} from "@lootopia/db/models/hunt"
import type {
  AccountTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "@lootopia/db/models/user"
import type { ColumnType } from "kysely"

export type Timestamp = ColumnType<
  Date,
  Date | string | undefined,
  Date | string
>

export interface Database {
  user: UserTable
  session: SessionTable
  account: AccountTable
  verification: VerificationTable
  hunts: HuntTable
  hunt_points: HuntPointTable
  hunt_rewards: HuntRewardTable
  quiz_questions: QuizQuestionTable
}
