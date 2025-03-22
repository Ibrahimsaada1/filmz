import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Validates request data against a Zod schema
 * Returns formatted errors if validation fails
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      // Convert Zod errors to a more API-friendly format
      const fieldErrors: Record<string, string> = {}

      result.error.errors.forEach((error) => {
        const path = error.path.join('.')
        fieldErrors[path] = error.message
      })

      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            fieldErrors,
          },
          { status: 400 },
        ),
      }
    }

    return { success: true, data: result.data }
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 },
      ),
    }
  }
}
