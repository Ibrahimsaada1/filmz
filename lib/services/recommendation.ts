import { PersonalizeRuntime } from 'aws-sdk'
import { dbClient } from '../internal/db-client'

import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCOUNT_ID,
} from '../config.server'
import { MovieWithRelations } from './tmdb'

function getPersonalizeClient() {
  return new PersonalizeRuntime({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  })
}

async function getAwsRecommendations(userId: number) {
  const campaignName = 'filmz-campaign'

  const campaignArn = `arn:aws:personalize:us-east-1:846745747492:campaign/filmz-campaign-xmMtJJVaa_`
  const personalize = getPersonalizeClient()
  const response = await personalize
    .getRecommendations({
      campaignArn,
      userId: userId.toString(),
      numResults: 6,
    })
    .promise()
  return response.itemList.map((item) => Number(item.itemId))
}

async function hydrateRecommendations(recommendations: number[]) {
  const hydratedRecommendations = await dbClient.movie.findMany({
    where: {
      id: { in: recommendations },
    },
    include: {
      genre: true,
      pricing: true,
    },
  })
  return hydratedRecommendations
}

export async function getRecommendations(
  userId: number,
): Promise<MovieWithRelations[]> {
  const recommendations = await getAwsRecommendations(userId)
  const hydratedRecommendations = await hydrateRecommendations(recommendations)
  return hydratedRecommendations.map((movie) => ({
    id: movie.id,
    title: movie.title,
    description: movie.description,
    releaseYear: movie.releaseDate,
    rating: movie.rating,
    thumbnailUrl: movie.thumbnailUrl,
    backdropUrl: movie.backdropUrl,
    category: movie.genre,
    tmdbId: movie.tmdbId,
    releaseDate: movie.releaseDate,
    genreId: movie.genreId,
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
  }))
}
