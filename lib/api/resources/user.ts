import { User as PrismaUser } from '@prisma/client'

/**
 * User Resource class for API responses
 * Handles transformation of Prisma User to API-friendly format
 */
export class UserResource {
  public user: PrismaUser

  constructor(user: PrismaUser) {
    this.user = user
  }

  /**
   * Convert to a plain JSON object for API responses
   */
  toJSON() {
    return {
      id: this.user.id,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      createdAt: this.user.createdAt.toISOString(),
      updatedAt: this.user.updatedAt.toISOString(),
    }
  }
}
