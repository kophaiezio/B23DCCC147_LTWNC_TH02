import { describe, expect, it } from 'vitest';
import { playlistReducer, type Playlist } from './playlistReducer';

const initial: Playlist[] = [{ id: 'p1', name: 'Buổi sáng', songIds: ['s1'] }];

describe('playlistReducer', () => {
  it('tạo playlist mới không làm thay đổi state cũ', () => {
    const next = playlistReducer(initial, { type: 'create', playlist: { id: 'p2', name: 'Đêm', songIds: [] } });
    expect(next).toHaveLength(2);
    expect(initial).toHaveLength(1);
  });

  it('thêm một bài đúng một lần vào playlist', () => {
    const next = playlistReducer(initial, { type: 'addSong', id: 'p1', songId: 's2' });
    expect(next[0].songIds).toEqual(['s1', 's2']);
    expect(playlistReducer(next, { type: 'addSong', id: 'p1', songId: 's2' })).toBe(next);
  });

  it('xóa bài và đổi tên playlist', () => {
    const withSong = playlistReducer(initial, { type: 'addSong', id: 'p1', songId: 's2' });
    const removed = playlistReducer(withSong, { type: 'removeSong', id: 'p1', songId: 's1' });
    const renamed = playlistReducer(removed, { type: 'rename', id: 'p1', name: 'Ngày mới' });
    expect(renamed[0]).toEqual({ id: 'p1', name: 'Ngày mới', songIds: ['s2'] });
  });

  it('giữ nguyên state khi xóa playlist không tồn tại', () => {
    expect(playlistReducer(initial, { type: 'remove', id: 'missing' })).toBe(initial);
  });

  it('xóa playlist đang có và bỏ qua dữ liệu tạo không hợp lệ', () => {
    expect(playlistReducer(initial, { type: 'remove', id: 'p1' })).toEqual([]);
    expect(playlistReducer(initial, { type: 'create', playlist: { id: 'p2', name: '  ', songIds: [] } })).toBe(initial);
  });
});
