import { render, screen } from '@testing-library/react';
import App from './App';

test('renders POSEI welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to POSEI/i);
  expect(linkElement).toBeInTheDocument();
});
