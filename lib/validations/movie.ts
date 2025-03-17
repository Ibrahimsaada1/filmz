import { z } from 'zod'

// Base movie schema
export const movieBaseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required'),
  thumbnailUrl: z.string().url('Invalid URL format').optional(),
  releaseDate: z.string().optional(),
  categoryId: z.number({ required_error: 'Category is required' }),
})

// Pricing schema
export const pricingSchema = z.object({
  basePrice: z
    .number({ required_error: 'Base price is required' })
    .min(0, 'Price cannot be negative'),
  discountPercent: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .optional(),
  discountStart: z.string().optional(),
  discountEnd: z.string().optional(),
  currency: z.string().default('USD'),
})

// Movie creation schema (includes pricing)
export const movieCreateSchema = movieBaseSchema.extend({
  pricing: pricingSchema.optional(),
})

// Movie update schema (all fields optional)
export const movieUpdateSchema = movieBaseSchema
  .partial()
  .extend({
    pricing: pricingSchema.partial().optional(),
  })

export type MovieCreateInput = z.infer<typeof movieCreateSchema>
export type MovieUpdateInput = z.infer<typeof movieUpdateSchema> 