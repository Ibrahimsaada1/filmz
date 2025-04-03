'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from './components/Header'

export default function Home() {
  const [_, setFeaturedMovie] = useState(null)
  const [__, setTrendingMovies] = useState([])
  const [____, setNewReleases] = useState([])
  const [___, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured movie
        const featuredResponse = await fetch('/api/movies/featured')
        const featuredData = await featuredResponse.json()
        setFeaturedMovie(featuredData)
        
        // Fetch trending movies
        const trendingResponse = await fetch('/api/movies/trending')
        const trendingData = await trendingResponse.json()
        setTrendingMovies(trendingData)
        
        // Fetch new releases
        const newReleasesResponse = await fetch('/api/movies/new-releases')
        const newReleasesData = await newReleasesResponse.json()
        setNewReleases(newReleasesData)
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              One Purchase. <span className="text-red-600">Any Platform.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Buy once, watch anywhere. No more juggling subscriptions or
              platform-hopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/movies"
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-md text-lg transition-colors items-center flex justify-center"
              >
                Browse Movies
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                href="/signup"
                className="border border-white/30 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-md text-lg transition-colors inline-flex items-center justify-center"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Filmz?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">One-Time Purchase</h3>
              <p className="text-gray-300">
                Buy your favorite movies once and own them forever. No recurring
                fees or subscription costs.
              </p>
            </div>

            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Watch Anywhere</h3>
              <p className="text-gray-300">
                Stream your purchased movies on any platform or device without
                creating multiple accounts.
              </p>
            </div>

            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">No Platform Lock-In</h3>
              <p className="text-gray-300">
                Freedom from platform exclusivity. Watch your content on
                Netflix, Disney+, or any other service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/90" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,0,0.1),transparent_70%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                AI-Powered <span className="text-red-600">Personalized</span>{' '}
                Recommendations
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our state-of-the-art AI analyzes your viewing habits to suggest
                movies you&apos;ll love, not what algorithms want you to watch.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Learns your unique taste profile beyond basic genres
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Discovers hidden gems tailored specifically to you
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Improves with every movie you watch or rate</span>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-800 p-6">
                <div className="text-sm font-medium text-red-500 mb-2">
                  RECOMMENDED FOR YOU
                </div>
                <h3 className="text-xl font-bold mb-1">Interstellar</h3>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-3">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm">98% Match</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Based on your interest in sci-fi dramas
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  A team of explorers travel through a wormhole in space in an
                  attempt to ensure humanity&apos;s survival.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">2014 • PG-13 • 169 min</span>
                  <span className="text-yellow-500 font-bold">★ 8.6</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-red-600/20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-blue-600/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                &quot;The AI recommendations are spot on! I&apos;ve discovered
                so many great films I would have never found otherwise.&quot;
              </p>
              <div className="flex items-center">
                <div className="font-medium">Sarah K.</div>
                <span className="mx-2 text-gray-500">•</span>
                <div className="text-sm text-gray-400">Film Enthusiast</div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                &quot;Finally, I can buy a movie once and watch it on any
                platform. No more subscription hopping or rebuying
                content!&quot;
              </p>
              <div className="flex items-center">
                <div className="font-medium">Michael T.</div>
                <span className="mx-2 text-gray-500">•</span>
                <div className="text-sm text-gray-400">Tech Professional</div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                &quot;The personalized recommendations are uncanny. It&apos;s
                like having a friend who knows exactly what movies I&apos;ll
                love.&quot;
              </p>
              <div className="flex items-center">
                <div className="font-medium">James L.</div>
                <span className="mx-2 text-gray-500">•</span>
                <div className="text-sm text-gray-400">Movie Collector</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Movie Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of movie lovers who&apos;ve freed themselves from
            platform limitations and discovered their next favorite films.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-md text-lg transition-colors inline-flex items-center justify-center"
            >
              Get Started Free
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <Link
              href="/movies"
              className="border border-white/30 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-md text-lg transition-colors inline-flex items-center justify-center"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link
                href="/"
                className="text-2xl font-bold text-white flex items-center"
              >
                <span className="text-red-600 mr-2">▶</span> Filmz
              </Link>
              <p className="text-gray-400 mt-2">Your universal movie library</p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Support
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/help"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Filmz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
