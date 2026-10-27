import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Song } from '../../types';
import { usePlayerStore } from './usePlayerStore';
import { PlayerBar } from './PlayerBar';

const song: Song = { id: 's1', title: 'Mưa đầu mùa', artist: 'Hà Anh', genre: 'Indie', duration: 150 };

beforeEach(() => {
  vi.useRealTimers();
  usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
});

describe('PlayerBar', () => {
  it('hiển thị trạng thái rỗng và thông tin bài đang phát', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    act(() => usePlayerStore.getState().playQueue([song]));
    expect(screen.getByText('Mưa đầu mùa')).toBeInTheDocument();
    expect(screen.getByText('Hà Anh')).toBeInTheDocument();
  });

  it('cập nhật tiến trình theo interval và dọn interval khi unmount', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue([song]);
    const { unmount } = render(<PlayerBar />);
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(2000));
    expect(usePlayerStore.getState().position).toBe(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
