import type { CSSProperties } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export function ProgressBar({ duration }: { duration: number }) {
  const position = usePlayerStore((state) => state.position);
  const seek = usePlayerStore((state) => state.seek);
  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="progress-control">
      <span className="player-time" aria-label="Thời gian hiện tại">{formatDuration(position)}</span>
      <input
        aria-label="Tua bài hát"
        className="progress-input"
        type="range"
        min={0}
        max={Math.max(duration, 1)}
        value={Math.min(position, duration)}
        style={{ '--progress': `${progress}%` } as CSSProperties & { '--progress': string }}
        onChange={(event) => seek(Number(event.currentTarget.value))}
      />
      <span className="player-time">{formatDuration(duration)}</span>
    </div>
  );
}
