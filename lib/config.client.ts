/**
 * Client-side configuration for Filmz
 * This file contains configuration that is safe to expose to the browser
 */

// Application configuration
export const APP_NAME = 'Filmz';
export const APP_DESCRIPTION = 'Your ultimate movie streaming platform';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API configuration
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// Feature flags - only include flags that are safe for client exposure
export const FEATURES = {
  ENABLE_REVIEWS: process.env.NEXT_PUBLIC_ENABLE_REVIEWS !== 'false',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
};

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// UI configuration
export const THEME = {
  PRIMARY_COLOR: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#E50914', // Netflix-like red
  SECONDARY_COLOR: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#221F1F', // Dark gray
  ACCENT_COLOR: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#F5F5F1', // Light gray
};

// Social media links
export const SOCIAL_MEDIA = {
  TWITTER: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/filmz',
  FACEBOOK: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/filmz',
  INSTAGRAM: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/filmz',
};

// Analytics configuration
export const ANALYTICS = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || '',
}; 