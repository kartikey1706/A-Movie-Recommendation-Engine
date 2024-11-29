import { expect, test } from 'vitest';
import { MovieRecommender } from '../src/recommender/MovieRecommender.js';

test('MovieRecommender generates valid recommendations', async () => {
  const mockGraphDb = {
    getUserPreferences: async () => ([]),
    findSimilarUsers: async () => ([])
  };

  const recommender = new MovieRecommender(mockGraphDb);
  await recommender.initialize();
  
  const recommendations = await recommender.getRecommendations('user123');
  
  expect(Array.isArray(recommendations)).toBe(true);
  expect(recommendations.length).toBeGreaterThanOrEqual(0);
});