import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Tên playlist không được để trống');
      return;
    }
    if (playlists.some((playlist) => playlist.name.toLocaleLowerCase('vi') === trimmedName.toLocaleLowerCase('vi'))) {
      setError('Tên playlist đã tồn tại');
      return;
    }
    dispatch({
      type: 'create',
      playlist: { id: crypto.randomUUID(), name: trimmedName, songIds: [] },
    });
    setName('');
    setError('');
  }

  return (
    <main className="page">
      <div className="page-eyebrow"><span>03 / BIÊN TẬP</span><span>{playlists.length} playlist</span></div>
      <section className="page-heading compact-heading"><div><p className="section-label">SẮP XẾP THEO CÁCH RIÊNG</p><h1>Playlist <em>của bạn.</em></h1></div></section>
      <form className="create-playlist-form" onSubmit={handleCreate} noValidate>
        <label htmlFor="playlist-name">Tạo playlist mới</label>
        <div className="form-controls">
          <input id="playlist-name" value={name} onChange={(event) => { setName(event.currentTarget.value); setError(''); }}
            aria-invalid={Boolean(error)} aria-describedby={error ? 'playlist-error' : undefined} placeholder="Ví dụ: Những ngày nắng" />
          <button className="primary-button" type="submit">Tạo playlist <span aria-hidden="true">＋</span></button>
        </div>
        {error && <p className="form-error" id="playlist-error" role="alert">{error}</p>}
      </form>
      <section className="playlist-section" aria-label="Danh sách playlist">
        {playlists.length === 0 ? (
          <div className="empty-state playlist-empty"><span className="empty-symbol" aria-hidden="true">≋</span><h2>Chưa có playlist nào.</h2><p>Tạo danh sách đầu tiên để gom những bài hát hợp tâm trạng.</p></div>
        ) : (
          <div className="playlist-grid">
            {playlists.map((playlist, index) => (
              <article className="playlist-card" key={playlist.id}>
                <span className="playlist-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="playlist-card-main">
                  <Link to={`/playlists/${playlist.id}`} className="playlist-name">{playlist.name}<span aria-hidden="true">↗</span></Link>
                  <span className="playlist-song-count">{playlist.songIds.length} bài hát</span>
                </div>
                <Link className="playlist-open" to={`/playlists/${playlist.id}`} aria-label={`Mở ${playlist.name}`}>Mở playlist</Link>
                <button className="icon-button delete-playlist" type="button" aria-label={`Xóa ${playlist.name}`}
                  onClick={() => dispatch({ type: 'remove', id: playlist.id })}>×</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
