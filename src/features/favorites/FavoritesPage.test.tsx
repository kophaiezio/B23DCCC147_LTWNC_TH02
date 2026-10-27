import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import FavoritesPage from './FavoritesPage';

beforeEach(() => {
  useFavoritesStore.setState({ ids: [] });
  window.localStorage.clear();
});

describe('FavoritesPage', () => {
  it('hướng dẫn người dùng khi danh sách yêu thích trống', () => {
    renderWithProviders(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Khám phá thư viện/ })).toHaveAttribute('href', '/');
  });

  it('phát tất cả bài yêu thích và cho phép bỏ yêu thích', () => {
    useFavoritesStore.setState({ ids: ['s1'] });
    renderWithProviders(<FavoritesPage />);
    expect(screen.getByRole('button', { name: /Phát tất cả/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ yêu thích' }));
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
  });

  it('lưu ID yêu thích bằng storage persist', () => {
    useFavoritesStore.getState().toggle('s1');
    expect(JSON.parse(window.localStorage.getItem('music-favorites') ?? '{}')).toMatchObject({ state: { ids: ['s1'] } });
  });
});
