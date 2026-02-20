import type { Generated } from "kysely"
import type { Timestamp } from "../schema"

export interface UserTable {
  id: string
  name: string
  email: string
  emailVerified: Generated<boolean>
  image: string | null
  bio: string | null
  role: string
  banned: boolean
  banReason: string | null
  banExpires: bigint | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SessionTable {
  id: string
  expiresAt: Timestamp
  token: string
  createdAt: Timestamp
  updatedAt: Timestamp
  ipAddress: string | null
  userAgent: string | null
  userId: string
  impersonatedBy: string | null
}

export interface AccountTable {
  id: string
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Timestamp | null
  refreshTokenExpiresAt: Timestamp | null
  scope: string | null
  password: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface VerificationTable {
  id: string
  identifier: string
  value: string
  expiresAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
