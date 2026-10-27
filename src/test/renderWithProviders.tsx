import { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistProvider } from '../contexts/PlaylistContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export function renderWithProviders(ui: ReactNode, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <PlaylistProvider>{ui}</PlaylistProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}
