import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Song } from '../../types';
import { SongRow } from './SongRow';

const song: Song = { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 };
const noop = vi.fn();

beforeEach(() => vi.clearAllMocks());

function renderRow(isFavorite = false, playlistId = 'p1') {
  return render(<SongRow song={song} index={0} isFavorite={isFavorite} playlistId={playlistId}
    onPlay={noop} onToggleFavorite={noop} onQueue={noop} onAddToPlaylist={noop} />);
}

describe('SongRow', () => {
  it('hiển thị tên bài và thời lượng đã định dạng', () => {
    renderRow();
    expect(screen.getByText(song.title)).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('phát đúng bài và bật tắt yêu thích bằng tên truy cập được', () => {
    renderRow();
    fireEvent.click(screen.getByRole('button', { name: `Phát ${song.title}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Thêm vào yêu thích' }));
    expect(noop).toHaveBeenNthCalledWith(1, song);
    expect(noop).toHaveBeenNthCalledWith(2, song.id);
  });

  it('hiển thị trạng thái bỏ yêu thích và khóa thao tác playlist khi chưa có playlist', () => {
    renderRow(true);
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: `Thêm ${song.title} vào playlist` })).toBeEnabled();
  });

  it('vô hiệu hóa thao tác playlist nếu chưa chọn playlist', () => {
    renderRow(false, '');
    expect(screen.getByRole('button', { name: `Thêm ${song.title} vào playlist` })).toBeDisabled();
  });
});
