import { memo, useCallback, useMemo, useState } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import { GENRES, SONGS } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import type { Song } from '../../types';
import { SongRow } from './SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';

type SortOrder = 'default' | 'name' | 'duration';
interface RowData {
  songs: Song[];
  favoriteIds: string[];
  playlistId: string;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onQueue: (song: Song) => void;
  onAddToPlaylist: (playlistId: string, song: Song) => void;
}

function VirtualSongRow({ index, style, data }: ListChildComponentProps<RowData>) {
  const song = data.songs[index];
  return (
    <div style={style}>
      <SongRow
        song={song}
        index={index}
        isFavorite={data.favoriteIds.includes(song.id)}
        playlistId={data.playlistId}
        onPlay={data.onPlay}
        onToggleFavorite={data.onToggleFavorite}
        onQueue={data.onQueue}
        onAddToPlaylist={data.onAddToPlaylist}
      />
    </div>
  );
}

const MemoVirtualSongRow = memo(VirtualSongRow);

function getSearchKey(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi');
}

export function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [feedback, setFeedback] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const activePlaylistId = selectedPlaylistId || playlists[0]?.id || '';

  const filteredSongs = useMemo(() => {
    const normalizedQuery = getSearchKey(debouncedQuery.trim());
    const filtered = SONGS.filter((song) => (
      (genre === 'all' || song.genre === genre)
      && (!normalizedQuery
        || getSearchKey(song.title).includes(normalizedQuery)
        || getSearchKey(song.artist).includes(normalizedQuery))
    ));
    if (sortOrder === 'name') return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    if (sortOrder === 'duration') return [...filtered].sort((a, b) => a.duration - b.duration);
    return filtered;
  }, [debouncedQuery, genre, sortOrder]);

  const handleQueryShift = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  }, []);

  const handlePlay = useCallback((song: Song) => {
    const songIndex = filteredSongs.findIndex((item) => item.id === song.id);
    if (songIndex >= 0) playQueue(filteredSongs, songIndex);
  }, [filteredSongs, playQueue]);

  const handleToggleFavorite = useCallback((id: string) => toggleFavorite(id), [toggleFavorite]);
  const handleQueue = useCallback((song: Song) => addToQueue(song), [addToQueue]);
  const handleAddToPlaylist = useCallback((playlistId: string, song: Song) => {
    const playlist = playlists.find((item) => item.id === playlistId);
    if (!playlist) {
      setFeedback('Hãy tạo playlist trước khi thêm bài hát.');
      return;
    }
    if (playlist.songIds.includes(song.id)) {
      setFeedback('Bài hát đã có trong playlist này.');
      return;
    }
    dispatch({ type: 'addSong', id: playlistId, songId: song.id });
    setFeedback(`Đã thêm “${song.title}” vào ${playlist.name}.`);
  }, [dispatch, playlists]);

  const rowData = useMemo<RowData>(() => ({
    songs: filteredSongs,
    favoriteIds,
    playlistId: activePlaylistId,
    onPlay: handlePlay,
    onToggleFavorite: handleToggleFavorite,
    onQueue: handleQueue,
    onAddToPlaylist: handleAddToPlaylist,
  }), [activePlaylistId, favoriteIds, filteredSongs, handleAddToPlaylist, handlePlay, handleQueue, handleToggleFavorite]);

  return (
    <main className="page library-page">
      <div className="page-eyebrow"><span>01 / THƯ VIỆN</span><span>10.000 bản thu mô phỏng</span></div>
      <section className="page-heading library-heading">
        <div>
          <p className="section-label">ÂM NHẠC CỦA BẠN</p>
          <h1>Thư viện <em>âm sắc.</em></h1>
          <p className="intro-copy">Một tuyển tập được tạo bằng thuật toán — sẵn sàng để bạn khám phá.</p>
        </div>
        <div className="library-mark" aria-hidden="true"><span>AS</span><i>♪</i></div>
      </section>

      <section className="library-tools" aria-label="Tìm kiếm và lọc bài hát">
        <label className="search-field">
          <span className="sr-only">Tìm bài hát hoặc ca sĩ</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" value={query} onChange={handleQueryShift} placeholder="Tìm bài hát, ca sĩ..." />
          {query && <button className="clear-search" type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery('')}>×</button>}
        </label>
        <label className="select-field">
          <span className="sr-only">Lọc theo thể loại</span>
          <select value={genre} onChange={(event) => setGenre(event.currentTarget.value)}>
            <option value="all">Tất cả thể loại</option>
            {GENRES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="select-field">
          <span className="sr-only">Sắp xếp bài hát</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.currentTarget.value as SortOrder)}>
            <option value="default">Mặc định</option>
            <option value="name">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </label>
        <label className="select-field playlist-picker">
          <span className="sr-only">Chọn playlist</span>
          <select value={activePlaylistId} onChange={(event) => setSelectedPlaylistId(event.currentTarget.value)} disabled={playlists.length === 0}>
            {playlists.length === 0 ? <option value="">Chưa có playlist</option> : playlists.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      </section>

      <div className="results-line" aria-live="polite">
        <span><strong>{filteredSongs.length.toLocaleString('vi-VN')}</strong> bài hát</span>
        <span className="column-heading"><span>BÀI HÁT</span><span>THỂ LOẠI</span><span>THỜI LƯỢNG</span></span>
      </div>
      {feedback && <p className="inline-feedback" role="status">{feedback}</p>}

      {filteredSongs.length > 0 ? (
        <FixedSizeList
          className="song-list"
          height={560}
          itemCount={filteredSongs.length}
          itemSize={56}
          width="100%"
          itemData={rowData}
          itemKey={(index, data: RowData) => data.songs[index].id}
        >
          {MemoVirtualSongRow}
        </FixedSizeList>
      ) : (
        <div className="empty-results"><span aria-hidden="true">⌕</span><p>Không tìm thấy bài hát nào</p><span>Thử đổi từ khóa hoặc bộ lọc của bạn.</span></div>
      )}
    </main>
  );
}
