import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaylistProvider } from '../../contexts/PlaylistContext';
import { renderWithProviders } from '../../test/renderWithProviders';
import PlaylistsPage from './PlaylistsPage';

describe('PlaylistsPage', () => {
  beforeEach(() => window.localStorage.clear());

  it('báo lỗi khi tên playlist để trống', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);
    await user.click(screen.getByRole('button', { name: /Tạo playlist/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên playlist không được để trống');
  });

  it('tạo và hiển thị playlist hợp lệ', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);
    await user.type(screen.getByLabelText('Tạo playlist mới'), 'Buổi chiều');
    await user.click(screen.getByRole('button', { name: /Tạo playlist/ }));
    expect(screen.getAllByRole('link', { name: /Buổi chiều/ })).toHaveLength(2);
    expect(screen.getByText('0 bài hát')).toBeInTheDocument();
  });

  it('không tạo playlist trùng tên khi khác chữ hoa thường', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('music-playlists', JSON.stringify([{ id: 'existing', name: 'Buổi chiều', songIds: [] }]));
    renderWithProviders(<PlaylistsPage />);
    await user.type(screen.getByLabelText('Tạo playlist mới'), 'buổi CHIỀU');
    await user.click(screen.getByRole('button', { name: /Tạo playlist/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên playlist đã tồn tại');
    expect(screen.getAllByText('Buổi chiều')).toHaveLength(1);
  });

  it('xóa playlist đã tạo', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('music-playlists', JSON.stringify([{ id: 'p1', name: 'Đi dạo', songIds: [] }]));
    renderWithProviders(<PlaylistsPage />);
    await user.click(screen.getByRole('button', { name: 'Xóa Đi dạo' }));
    expect(screen.getByText('Chưa có playlist nào.')).toBeInTheDocument();
  });

  it('phục hồi playlist đã lưu khi mount provider', () => {
    window.localStorage.setItem('music-playlists', JSON.stringify([{ id: 'p1', name: 'Lưu trữ', songIds: [] }]));
    renderWithProviders(<PlaylistProvider><PlaylistsPage /></PlaylistProvider>);
    expect(screen.getAllByRole('link', { name: /Lưu trữ/ })).toHaveLength(2);
  });

  it('xử lý JSON playlist lỗi mà không làm hỏng trang', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.localStorage.setItem('music-playlists', '{not json');
    renderWithProviders(<PlaylistsPage />);
    expect(screen.getByText('Chưa có playlist nào.')).toBeInTheDocument();
    expect(error).toHaveBeenCalledWith('Không thể đọc playlist từ localStorage.', expect.any(SyntaxError));
    error.mockRestore();
  });
});
