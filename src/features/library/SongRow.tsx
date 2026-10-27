import { memo } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  song: Song;
  index: number;
  isFavorite: boolean;
  playlistId: string;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onQueue: (song: Song) => void;
  onAddToPlaylist: (playlistId: string, song: Song) => void;
  onRemoveFromPlaylist?: (songId: string) => void;
}

function SongRowComponent({
  song,
  index,
  isFavorite,
  playlistId,
  onPlay,
  onToggleFavorite,
  onQueue,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}: SongRowProps) {
  return (
    <div className="song-row" role="listitem" aria-label={`${song.title} — ${song.artist}`}>
      <span className="song-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="song-identity">
        <button className="song-title" type="button" onClick={() => onPlay(song)}>{song.title}</button>
        <span className="song-artist">{song.artist}</span>
      </div>
      <span className="song-genre">{song.genre}</span>
      <span className="song-duration">{formatDuration(song.duration)}</span>
      <div className="song-actions">
        <button className="icon-button play-small" type="button" aria-label={`Phát ${song.title}`} onClick={() => onPlay(song)}>
          <span aria-hidden="true">▶</span>
        </button>
        <button
          className={`icon-button favorite-button${isFavorite ? ' is-favorite' : ''}`}
          type="button"
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(song.id)}
        >
          <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
        </button>
        <button className="icon-button queue-button" type="button" aria-label="Thêm vào hàng đợi" onClick={() => onQueue(song)}>
          <span aria-hidden="true">＋</span>
        </button>
        {onRemoveFromPlaylist ? (
          <button className="text-button remove-song-button" type="button" onClick={() => onRemoveFromPlaylist(song.id)}>Bỏ</button>
        ) : (
          <button
            className="text-button playlist-add-button"
            type="button"
            disabled={!playlistId}
            aria-label={`Thêm ${song.title} vào playlist`}
            onClick={() => onAddToPlaylist(playlistId, song)}
          >
            + Playlist
          </button>
        )}
      </div>
    </div>
  );
}

export const SongRow = memo(SongRowComponent);
