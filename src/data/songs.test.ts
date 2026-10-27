import { describe, expect, it } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('tạo đủ 10.000 bài hát', () => {
    expect(generateSongs(10000)).toHaveLength(10000);
  });

  it('tạo ID duy nhất và thời lượng trong khoảng hợp lệ', () => {
    const songs = generateSongs(10000);
    expect(new Set(songs.map((song) => song.id)).size).toBe(10000);
    expect(songs.every((song) => song.duration >= 150 && song.duration <= 300)).toBe(true);
  });

  it('giữ đúng công thức dữ liệu và tạo kết quả ổn định', () => {
    const first = generateSongs(2);
    expect(first[0]).toEqual({ id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 });
    expect(generateSongs(2)).toEqual(first);
  });

  it('xử lý số lượng âm hoặc không hợp lệ an toàn', () => {
    expect(generateSongs(-2)).toEqual([]);
    expect(generateSongs(Number.NaN)).toEqual([]);
  });
});
