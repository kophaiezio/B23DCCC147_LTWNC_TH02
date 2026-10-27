import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import PlaylistDetailPage from './PlaylistDetailPage';

function renderDetail(path: string) {
  return renderWithProviders(
    <Routes><Route path="/playlists/:id" element={<PlaylistDetailPage />} /></Routes>,
    [path],
  );
}

describe('PlaylistDetailPage', () => {
  it('thông báo playlist không tồn tại', () => {
    renderDetail('/playlists/khong-co');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('hiển thị tổng thời lượng, phát danh sách và bỏ bài', () => {
    window.localStorage.setItem('music-playlists', JSON.stringify([{ id: 'p1', name: 'Nhạc nhẹ', songIds: ['s1'] }]));
    renderDetail('/playlists/p1');
    expect(screen.getByText(/Tổng thời lượng: 2 phút 30 giây/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Phát tất cả/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ' }));
    expect(screen.getByText('Playlist này còn trống.')).toBeInTheDocument();
  });
});
