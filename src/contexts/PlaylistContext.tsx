import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { playlistReducer, type Playlist, type PlaylistAction } from '../features/playlists/playlistReducer';
import { withLogger } from '../features/playlists/withLogger';

const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | undefined>(undefined);

function isPlaylist(value: unknown): value is Playlist {
  return typeof value === 'object'
    && value !== null
    && 'id' in value && typeof value.id === 'string' && value.id.trim().length > 0
    && 'name' in value && typeof value.name === 'string' && value.name.trim().length > 0
    && 'songIds' in value && Array.isArray(value.songIds)
    && value.songIds.every((songId: unknown) => typeof songId === 'string' && songId.length > 0)
    && new Set(value.songIds).size === value.songIds.length;
}

function isPlaylistList(value: unknown): value is Playlist[] {
  return Array.isArray(value)
    && value.every(isPlaylist)
    && new Set(value.map((playlist) => playlist.id)).size === value.length;
}

function loadPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('music-playlists');
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (isPlaylistList(parsed)) return parsed;
    console.warn('Dữ liệu playlist trong localStorage không hợp lệ; đã khởi tạo danh sách trống.');
    return [];
  } catch (error) {
    console.error('Không thể đọc playlist từ localStorage.', error);
    return [];
  }
}

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, dispatch] = useReducer(withLogger(playlistReducer), undefined, loadPlaylists);
  const stateValue = useMemo(() => playlists, [playlists]);

  useEffect(() => {
    try {
      window.localStorage.setItem('music-playlists', JSON.stringify(playlists));
    } catch (error) {
      console.error('Không thể lưu playlist vào localStorage.', error);
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={stateValue}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const value = useContext(PlaylistStateContext);
  if (value === undefined) throw new Error('usePlaylists phải được sử dụng bên trong PlaylistProvider.');
  return value;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const value = useContext(PlaylistDispatchContext);
  if (value === undefined) throw new Error('usePlaylistDispatch phải được sử dụng bên trong PlaylistProvider.');
  return value;
}
