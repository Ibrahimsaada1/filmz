/**
 * Server-side configuration for Filmz
 * This file contains configuration that is only available on the server
 */
// Add this import at the top
import ms from 'ms'

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'your-database-url'

// Application configuration
export const APP_NAME = 'Filmz'
export const APP_DESCRIPTION = 'Your ultimate movie streaming platform'
export const APP_URL = process.env.APP_URL || 'http://localhost:3000'

// API configuration
export const API_VERSION = 'v1'
export const API_PREFIX = `/api/${API_VERSION}`

// Authentication configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
export const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || ('7d' as ms.StringValue)

// Payment configuration (for a real app, these would be set in environment variables)
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

// Email configuration
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@filmz.com'
export const EMAIL_SERVER = process.env.EMAIL_SERVER || ''

// Feature flags
export const FEATURES = {
  ENABLE_REVIEWS: process.env.ENABLE_REVIEWS !== 'false',
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS === 'true',
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
}

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_TEST = process.env.NODE_ENV === 'test'

// TMDB API Configuration
export const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || ''
export const TMDB_API_URL = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_URL = process.env.TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p'
