'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { FormInput } from '@/app/components/FormInput'
import { Header } from '@/app/components/Header'

export default function LoginPageClient({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const redirect = searchParams['redirect'] || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        router.push(redirect as string)
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-center text-3xl font-bold text-white mb-6">
              Log in to your account
            </h2>

            {error && (
              <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-6">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 rounded bg-gray-700"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-red-500 hover:text-red-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-red-500 hover:text-red-400"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
