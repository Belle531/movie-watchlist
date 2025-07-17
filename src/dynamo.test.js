// ✅ Use the manual mock
jest.mock('./dynamo');

// src/dynamo.test.js
import { scanMovies } from './dynamo'; // Keep only this line


describe('scanMovies', () => {
  test('returns mocked movie list with correct data', async () => {
    const movies = await scanMovies();

    expect(movies).toHaveLength(2);
    expect(movies[0].title).toBe('Inception');
    expect(movies[1].watched).toBe(false);
  });
});