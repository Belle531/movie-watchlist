import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { scanMovies } from './dynamo'; // Re-import after mock

// Inline mock for scanMovies
jest.mock('./dynamo', () => ({
  scanMovies: jest.fn().mockResolvedValue([
    { id: '1', title: 'Akeelah and the Bee', year: 2006, watched: true },
    { id: '2', title: 'The Matrix', year: 1999, watched: false }
  ])
}));

test('renders movie titles from mocked scanMovies', async () => {
  render(<App />);

  await waitFor(() => expect(scanMovies).toHaveBeenCalled());

  expect(await screen.findByText('Akeelah and the Bee')).toBeInTheDocument();
  expect(await screen.findByText('The Matrix')).toBeInTheDocument();
});
