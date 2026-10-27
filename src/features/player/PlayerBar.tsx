import { useEffect } from 'react';
import type { Song } from '../../types';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

function CurrentTrack({ song }: { song: Song | undefined }) {
  return (
    <div className="current-track" aria-live="polite" aria-label={song ? `Đang phát: ${song.title} – ${song.artist}` : 'Chưa phát bài nào'}>
      <span className="track-kicker">ĐANG NGHE</span>
      {song ? (
        <div>
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
        </div>
      ) : <p>Chưa phát bài nào</p>}
    </div>
  );
}

export function PlayerBar() {
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const next = usePlayerStore((state) => state.next);
  const prev = usePlayerStore((state) => state.prev);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const tick = usePlayerStore((state) => state.tick);
  const currentSong = queue[currentIndex];

  useEffect(() => {
    if (!isPlaying || !currentSong) return undefined;
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [currentSong, isPlaying, tick]);

  return (
    <footer className="player-bar" aria-label="Trình phát nhạc">
      <CurrentTrack song={currentSong} />
      <div className="player-center">
        <div className="player-buttons">
          <button className="player-control" type="button" aria-label="Bài trước" onClick={prev}>⏮</button>
          <button
            className="player-control player-toggle"
            type="button"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            aria-pressed={isPlaying}
            onClick={togglePlay}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <button className="player-control" type="button" aria-label="Bài sau" onClick={next}>⏭</button>
        </div>
        {currentSong && <ProgressBar duration={currentSong.duration} />}
      </div>
      <span className="queue-count">Hàng đợi <strong>{queue.length}</strong></span>
    </footer>
  );
}
