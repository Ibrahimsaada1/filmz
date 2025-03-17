import { useMutation } from '@tanstack/react-query'
import { apiClient } from './client'

export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient<AuthResponse, LoginCredentials>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      }),
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      apiClient<AuthResponse, SignupCredentials>('/api/auth/signup', {
        method: 'POST',
        body: credentials,
      }),
  })
}
