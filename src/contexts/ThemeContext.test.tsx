import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" onClick={toggleTheme}>Giao diện {theme === 'light' ? 'tối' : 'sáng'}</button>;
}

describe('ThemeContext', () => {
  it('đổi theme toàn ứng dụng và ghi nhớ lựa chọn', () => {
    render(<ThemeProvider><ThemeButton /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Giao diện tối' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Giao diện tối' }));
    expect(screen.getByRole('button', { name: 'Giao diện sáng' })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('music-theme')).toBe('dark');
  });
});
