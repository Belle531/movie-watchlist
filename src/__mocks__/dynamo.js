// __mocks__/dynamo.js

export const scanMovies = jest.fn(() => {
  return [
    {
      title: 'Akeelah and the Bee',
      watched: false,
      id: 'mock-id-1',
      review: 'A heartwarming movie.',
      genre: 'Family',
      rating: 5,
    },
    {
      title: 'The Matrix', // Or whatever second movie you want to mock
      watched: false,
      id: 'mock-id-2',
      review: 'Mind-bending sci-fi.',
      genre: 'Artificial Intelligence',
      rating: 4,
    },
    // Add more mock data if your test expects more items,
    // but the current test expects only 2.
  ];
});

// If you have other functions in dynamo.js that are imported elsewhere,
// you might need to mock them here as well, e.g.:
// export const addMovie = jest.fn();
// export const updateMovie = jest.fn();
// export const deleteMovie = jest.fn();