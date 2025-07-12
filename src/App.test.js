import { render, screen } from '@testing-library/react';
import App from './App';

test("renders movie watchlist title", () => {
  render(<App />);
  const title = screen.getByText(/movie watchlist/i);
  expect(title).toBeInTheDocument();
});
