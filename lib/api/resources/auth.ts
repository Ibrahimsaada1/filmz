import { User as PrismaUser } from '@prisma/client'
import { UserResource } from './user'

/**
 * Auth Resource class for authentication responses
 * Handles transformation of auth data to API-friendly format
 */
export class AuthResource {
  private user: PrismaUser
  private token: string

  constructor(user: PrismaUser, token: string) {
    this.user = user
    this.token = token
  }

  /**
   * Convert to a plain JSON object for API responses
   */
  toJSON() {
    return {
      user: new UserResource(this.user).toJSON(),
      token: this.token,
    }
  }
} 