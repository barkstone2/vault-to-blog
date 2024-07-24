import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('default test', () => {
  render(<App />);
  const element = screen.getByText('Click on the Vite and React logos to learn more');
  expect(element).toBeInTheDocument();
});