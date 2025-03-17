import { APP_URL } from '../config.client'

interface FetchOptions<BodyType> extends Omit<RequestInit, 'body'> {
  token?: string | null
  body?: BodyType
}

export async function apiClient<T, BodyType>(
  endpoint: string,
  { token, ...customConfig }: FetchOptions<BodyType> = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    ...customConfig,
    body: customConfig.body as BodyInit,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (customConfig.body) {
    config.body = JSON.stringify(customConfig.body)
  }

  const response = await fetch(`${APP_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    // Format error for better handling in components
    if (response.status === 400 && data.fieldErrors) {
      throw new Error(
        JSON.stringify({
          error: data.error || 'Validation failed',
          fieldErrors: data.fieldErrors,
        })
      )
    }
    
    throw new Error(
      JSON.stringify({
        error: data.error || 'Something went wrong',
        status: response.status,
      })
    )
  }

  return data as T
} 