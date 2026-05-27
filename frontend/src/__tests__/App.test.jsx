import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

test('renders app title', () => {
  render(<App />);
  const el = screen.getByText(/SimpleCalc/i);
  expect(el).toBeInTheDocument();
});
