import { beforeEach, describe, expect, it } from 'vitest';
import type { Song } from '../../types';
import { usePlayerStore } from './usePlayerStore';

const tracks: Song[] = [
  { id: 's1', title: 'Mưa', artist: 'Lê Minh', genre: 'Pop', duration: 5 },
  { id: 's2', title: 'Nắng', artist: 'Hà Anh', genre: 'Ballad', duration: 10 },
];

beforeEach(() => usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 }));

describe('usePlayerStore', () => {
  it('phát hàng đợi từ đúng bài và đặt lại thời gian', () => {
    usePlayerStore.setState({ position: 4 });
    usePlayerStore.getState().playQueue(tracks, 1);
    expect(usePlayerStore.getState()).toMatchObject({ queue: tracks, currentIndex: 1, position: 0, isPlaying: true });
  });

  it('xử lý queue rỗng và chỉ số bắt đầu không hợp lệ', () => {
    usePlayerStore.getState().playQueue([], 0);
    expect(usePlayerStore.getState().currentIndex).toBe(-1);
    usePlayerStore.getState().playQueue(tracks, 5);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('không bắt đầu phát khi chưa có bài và cho phép tạm dừng', () => {
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    usePlayerStore.getState().playQueue(tracks);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('bỏ qua bài đã có trong hàng đợi', () => {
    usePlayerStore.getState().playQueue(tracks);
    const current = usePlayerStore.getState();
    current.addToQueue(tracks[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });

  it('tăng thời gian khi đang phát và chuyển bài khi hết bài', () => {
    usePlayerStore.getState().playQueue(tracks);
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState().position).toBe(1);
    usePlayerStore.setState({ position: 4 });
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 0, isPlaying: true });
  });

  it('dừng ở cuối hàng đợi mà không vượt thời lượng', () => {
    usePlayerStore.getState().playQueue(tracks, 1);
    usePlayerStore.setState({ position: 9 });
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 10, isPlaying: false });
  });

  it('lùi bài nếu thời gian không vượt ba giây và tua lại nếu đã nghe lâu hơn', () => {
    usePlayerStore.getState().playQueue(tracks, 1);
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    usePlayerStore.setState({ currentIndex: 1, position: 4 });
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 0 });
  });

  it('tua về đầu ở bài đầu và giới hạn thao tác seek', () => {
    usePlayerStore.getState().playQueue(tracks);
    usePlayerStore.getState().seek(99);
    expect(usePlayerStore.getState().position).toBe(5);
    usePlayerStore.getState().seek(-2);
    expect(usePlayerStore.getState().position).toBe(0);
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });
});
