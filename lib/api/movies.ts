import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { useAuth } from '../auth/AuthContext'

export interface Movie {
  id: number
  title: string
  description: string
  releaseYear: number
  genre: string
  director: string
  posterUrl: string
  trailerUrl?: string
  price: number
  thumbnailUrl: string | null
  backdropUrl: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
  }
  pricing?: {
    basePrice: number
    discountPercent?: number
    discountPrice?: number
  }
}

// Query keys
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: string) => [...movieKeys.lists(), { filters }] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
}

// Get all movies with optional filtering
export function useMovies(filters?: Record<string, string>) {
  const { token } = useAuth()
  
  const queryString = filters 
    ? `?${new URLSearchParams(filters).toString()}`
    : ''
  
  return useQuery({
    queryKey: movieKeys.list(queryString),
    queryFn: async () => {
      const data = await apiClient<{ movies: Movie[], pagination: any }>(`/api/movies${queryString}`, { token })
      return data.movies
    },
  })
}

// Get a single movie by ID
export function useMovie(id: number) {
  const { token } = useAuth()
  
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => 
      apiClient<{ movie: Movie }>(`/api/movies/${id}`, { token })
        .then(data => data.movie),
  })
}

// Add a new movie (admin only)
export function useAddMovie() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (newMovie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient<{ movie: Movie }>('/api/movies', {
        method: 'POST',
        body: newMovie,
        token,
      }).then(data => data.movie),
    onSuccess: () => {
      // Invalidate and refetch movies list
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
    },
  })
}

// Update a movie (admin only)
export function useUpdateMovie() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<Movie> & { id: number }) => 
      apiClient<{ movie: Movie }>(`/api/movies/${id}`, {
        method: 'PUT',
        body: updates,
        token,
      }).then(data => data.movie),
    onSuccess: (data) => {
      // Update the movie in the cache
      queryClient.invalidateQueries({ queryKey: movieKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
    },
  })
}

// Delete a movie (admin only)
export function useDeleteMovie() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => 
      apiClient<{ success: boolean }>(`/api/movies/${id}`, {
        method: 'DELETE',
        token,
      }),
    onSuccess: (_, id) => {
      // Remove the movie from the cache
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() })
      queryClient.removeQueries({ queryKey: movieKeys.detail(id) })
    },
  })
}

const processMovie = (data: any): Movie => {
  return {
    ...data,
    thumbnailUrl: data.thumbnailUrl || null,
    backdropUrl: data.backdropUrl || null,
    // ... process other fields
  }
} 