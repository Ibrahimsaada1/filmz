// When creating movie records
await prisma.movie.create({
  data: {
    // ... other fields
    thumbnailUrl: movie.poster_path 
      ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}` 
      : '/images/placeholder.png',
    backdropUrl: movie.backdrop_path 
      ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}` 
      : null,
  }
}) 