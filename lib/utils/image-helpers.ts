export function getMovieImageUrl(path: string | null, type: 'poster' | 'backdrop' = 'poster'): string {
  if (!path) {
    return type === 'poster' ? '/images/placeholder.png' : '/images/placeholder-backdrop.png';
  }
  
  const baseUrl = 'https://image.tmdb.org/t/p';
  const size = type === 'poster' ? 'w500' : 'original';
  return `${baseUrl}/${size}${path}`;
} 