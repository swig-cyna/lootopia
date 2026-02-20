import type { ColumnType } from "kysely"
import type { AccountTable, SessionTable, UserTable, VerificationTable } from "./models/user"
import type {
  HuntPointTable,
  HuntRewardTable,
  HuntTable,
  QuizQuestionTable,
} from "./models/hunt"

export type Timestamp = ColumnType<Date, Date | string, Date | string>

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
