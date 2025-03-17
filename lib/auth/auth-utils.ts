import { getServerSession } from '../auth'

export async function verifyAuth() {
  try {
    // Get token from Authorization header
    const user = await getServerSession()

    if (!user) {
      return { success: false, error: 'Empty token' }
    }

    // Verify token
    try {
      return {
        success: true,
        userId: user.id,
        email: user.email,
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError)
      return { success: false, error: 'Invalid or expired token' }
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { success: false, error: 'Authentication error' }
  }
}
