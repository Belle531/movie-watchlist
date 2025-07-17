export const scanMovies = jest.fn(() =>
  Promise.resolve([
    {
      id: '0.11',
      title: 'Akeelah and the Bee',
      genre: 'Family',
      review: 'A young gifted girl enters a spelling bee.',
      rating: 5,
      watched: false
    },
    {
      id: '01d3c354-e4b2-4bc2-87c0-0cffcc8ca328',
      title: 'The Matrix',
      genre: 'Artificial Intelligence',
      review: 'A hacker discovers reality is a simulation.',
      rating: 4,
      watched: false
    }
  ])
);