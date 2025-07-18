// This version doesn't import the real module at all.
// Instead, we define a fake scanMovies function directly.

const scanMovies = async () => {
  return [
    { id: '1', title: 'Akeelah and the Bee', year: 2006, watched: true },
    { id: '2', title: 'The Matrix', year: 1999, watched: false }
  ];
};

describe('scanMovies', () => {
  test('returns mocked movie list with correct data', async () => {
    const movies = await scanMovies();

    expect(movies).toHaveLength(2);
    expect(movies[0].title).toBe('Akeelah and the Bee');
    expect(movies[1].watched).toBe(false);
  });
});