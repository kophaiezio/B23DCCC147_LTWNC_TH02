import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import { renderWithProviders } from '../../test/renderWithProviders';
import { LibraryPage } from './LibraryPage';

describe('LibraryPage', () => {
  it('hiển thị danh sách ảo hóa với số lượng bài hát đầy đủ', () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText('10.000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát Mưa tháng Sáu 1' })).toBeInTheDocument();
  });

  it('chỉ áp dụng từ khóa sau 300 mili giây và hỗ trợ tìm kiếm không dấu', () => {
    vi.useFakeTimers();
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm bài hát hoặc ca sĩ' }), { target: { value: 'Le Minh' } });
    expect(screen.getByText('10.000')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText('1.000')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('lọc thể loại và hiển thị trạng thái không có kết quả', () => {
    vi.useFakeTimers();
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Lọc theo thể loại'), { target: { value: 'Rock' } });
    expect(screen.getByText('2.000')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm bài hát hoặc ca sĩ' }), { target: { value: 'không có bài này' } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('phát hàng đợi theo thứ tự đang lọc và thêm bài vào playlist đã chọn', () => {
    window.localStorage.setItem('music-playlists', JSON.stringify([{ id: 'p1', name: 'Sáng', songIds: [] }]));
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Lọc theo thể loại'), { target: { value: 'Rock' } });
    fireEvent.click(screen.getAllByRole('button', { name: /^Phát / })[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(2000);
    expect(usePlayerStore.getState().queue[0].genre).toBe('Rock');
    const addButton = screen.getAllByRole('button', { name: /vào playlist/ })[0];
    fireEvent.click(addButton);
    expect(screen.getByRole('status')).toHaveTextContent('Đã thêm');
    fireEvent.click(addButton);
    expect(screen.getByRole('status')).toHaveTextContent('Bài hát đã có trong playlist này.');
  });
});
