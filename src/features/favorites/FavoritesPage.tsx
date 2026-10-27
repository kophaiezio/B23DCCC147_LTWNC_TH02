import { Link } from 'react-router-dom';
import { SONGS } from '../../data/songs';
import { SongRow } from '../library/SongRow';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';
import type { Song } from '../../types';

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids);
  const toggle = useFavoritesStore((state) => state.toggle);
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const songs = ids.map((id) => SONGS.find((song) => song.id === id)).filter((song): song is Song => song !== undefined);
  const firstPlaylistId = playlists[0]?.id ?? '';
  const playSong = (song: Song) => playQueue(songs, songs.findIndex((item) => item.id === song.id));
  const addSong = (playlistId: string, song: Song) => dispatch({ type: 'addSong', id: playlistId, songId: song.id });

  return (
    <main className="page">
      <div className="page-eyebrow"><span>02 / BỘ SƯU TẬP</span><span>{songs.length} bài đã lưu</span></div>
      <section className="page-heading compact-heading">
        <div><p className="section-label">DẤU ẤN CỦA BẠN</p><h1>Bài hát <em>yêu thích.</em></h1></div>
        {songs.length > 0 && <button className="primary-button" type="button" onClick={() => playQueue(songs)}>▶ Phát tất cả</button>}
      </section>
      {songs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol" aria-hidden="true">♡</span>
          <h2>Một góc nhạc đang chờ bạn.</h2>
          <p>Bạn chưa có bài hát yêu thích.</p>
          <p>Bấm biểu tượng trái tim ở bài hát bất kỳ để lưu lại những giai điệu bạn yêu thích.</p>
          <Link className="text-link" to="/">Khám phá thư viện <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <div className="static-song-list" role="list">
          {songs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} isFavorite playlistId={firstPlaylistId}
              onPlay={playSong} onToggleFavorite={toggle} onQueue={addToQueue} onAddToPlaylist={addSong} />
          ))}
        </div>
      )}
    </main>
  );
}
