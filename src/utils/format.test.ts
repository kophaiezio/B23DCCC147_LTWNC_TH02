import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('định dạng 0 giây thành 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('thêm số 0 trước số giây nhỏ hơn 10', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('định dạng số phút tròn', () => {
    expect(formatDuration(300)).toBe('5:00');
  });

  it('không tạo thời lượng âm hoặc vô hạn', () => {
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
});
