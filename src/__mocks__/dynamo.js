// Manual mock for dynamo.js using CommonJS syntax
module.exports = {
  scanMovies: jest.fn().mockResolvedValue([
    { id: '1', title: 'Akeelah and the Bee', year: 2006, watched: true },
    { id: '2', title: 'The Matrix', year: 1999, watched: false }
  ]),
  createMovie: jest.fn(),
  updateMovie: jest.fn(),
  deleteMovie: jest.fn()
};