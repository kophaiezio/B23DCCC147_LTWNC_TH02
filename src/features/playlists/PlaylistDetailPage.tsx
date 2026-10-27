import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import { SongRow } from '../library/SongRow';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';
import type { Song } from '../../types';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const playlists = usePlaylists();
  const playlist = playlists.find((item) => item.id === id);
  const dispatch = usePlaylistDispatch();
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const songs = useMemo(() => playlist?.songIds
    .map((songId) => SONGS.find((song) => song.id === songId))
    .filter((song): song is Song => song !== undefined) ?? [], [playlist]);
  const duration = songs.reduce((total, song) => total + song.duration, 0);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (!playlist) {
    return <main className="page missing-playlist"><p className="section-label">404 / KHÔNG TÌM THẤY</p><h1>Không tìm thấy playlist</h1><Link className="text-link" to="/playlists">Quay lại playlist <span aria-hidden="true">↗</span></Link></main>;
  }

  const playSong = (song: Song) => playQueue(songs, songs.findIndex((item) => item.id === song.id));
  const removeSong = (songId: string) => dispatch({ type: 'removeSong', id: playlist.id, songId });
  const noPlaylist = '';

  return (
    <main className="page">
      <div className="page-eyebrow"><Link to="/playlists" className="breadcrumb-link">← TẤT CẢ PLAYLIST</Link><span>PLAYLIST / {playlist.id.slice(0, 6)}</span></div>
      <section className="page-heading compact-heading">
        <div><p className="section-label">DANH SÁCH ĐÃ BIÊN TẬP</p><h1>{playlist.name}<em>.</em></h1>
          <p className="intro-copy">{songs.length} bài · Tổng thời lượng: {minutes} phút {seconds} giây</p>
        </div>
        {songs.length > 0 && <button className="primary-button" type="button" onClick={() => playQueue(songs)}>▶ Phát tất cả</button>}
      </section>
      {songs.length === 0 ? (
        <div className="empty-state"><span className="empty-symbol" aria-hidden="true">＋</span><h2>Playlist này còn trống.</h2><p>Thêm bài hát từ thư viện để bắt đầu danh sách của bạn.</p><Link className="text-link" to="/">Đi tới thư viện <span aria-hidden="true">↗</span></Link></div>
      ) : (
        <div className="static-song-list" role="list">
          {songs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} isFavorite={favoriteIds.includes(song.id)} playlistId={noPlaylist}
              onPlay={playSong} onToggleFavorite={toggleFavorite} onQueue={addToQueue} onAddToPlaylist={() => undefined} onRemoveFromPlaylist={removeSong} />
          ))}
        </div>
      )}
      <span className="sr-only">Tổng thời lượng định dạng: {formatDuration(duration)}</span>
    </main>
  );
}
