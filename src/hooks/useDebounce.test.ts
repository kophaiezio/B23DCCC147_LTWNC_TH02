import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  afterEach(() => vi.useRealTimers());

  it('giữ giá trị trước đó trước khi hết thời gian chờ', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'đầu' } });
    rerender({ value: 'mới' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('đầu');
  });

  it('trả giá trị mới sau đúng 300 mili giây', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'đầu' } });
    rerender({ value: 'mới' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('mới');
  });

  it('dọn timer khi unmount', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useDebounce('âm sắc', 300));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
