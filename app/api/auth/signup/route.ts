import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { JWT_SECRET, JWT_EXPIRES_IN } from '@/lib/config.server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import ms from 'ms'
import { AuthResource } from '@/lib/api/resources/auth'
import { signupSchema } from '@/lib/validations/auth'
import { validateRequest } from '@/lib/api/validation'
import { addCorsHeaders } from '@/lib/api/cors'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Validate request using Zod
    const validation = await validateRequest(request, signupSchema)

    if (!validation.success) {
      return addCorsHeaders(NextResponse.json({ error: 'Invalid request' }, { status: 400 }), request)
    }

    const { firstname, lastname, email, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return addCorsHeaders(
        NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 },
        ),
        request,
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    })

    // Generate JWT token
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
        },
        JWT_SECRET!,
        { expiresIn: JWT_EXPIRES_IN as ms.StringValue },
        (err, token) => {
          if (err) reject(err)
          if (!token) reject(new Error('Failed to generate token'))
          resolve(token!)
        },
      )
    })

    // Create the response using our Auth Resource class
    const authResource = new AuthResource(user, token)
    return addCorsHeaders(NextResponse.json(authResource), request)
  } catch (error) {
    console.error('Signup error:', error)
    return addCorsHeaders(
      NextResponse.json({ error: 'Something went wrong' }, { status: 500 }),
      request,
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: Request) {
  return addCorsHeaders(NextResponse.json({}, { status: 200 }), request)
}
