export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; playlist: Playlist }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; id: string; songId: string }
  | { type: 'removeSong'; id: string; songId: string };

export function playlistReducer(state: Playlist[], action: PlaylistAction): Playlist[] {
  switch (action.type) {
    case 'create':
      if (!action.playlist.id || !action.playlist.name.trim() || state.some((item) => item.id === action.playlist.id)) return state;
      return [...state, { ...action.playlist, name: action.playlist.name.trim(), songIds: [...new Set(action.playlist.songIds)] }];
    case 'rename': {
      const current = state.find((playlist) => playlist.id === action.id);
      if (!current || !action.name.trim() || current.name === action.name.trim()) return state;
      return state.map((playlist) => playlist.id === action.id ? { ...playlist, name: action.name.trim() } : playlist);
    }
    case 'remove': {
      const nextState = state.filter((playlist) => playlist.id !== action.id);
      return nextState.length === state.length ? state : nextState;
    }
    case 'addSong': {
      const target = state.find((playlist) => playlist.id === action.id);
      if (!target || target.songIds.includes(action.songId)) return state;
      return state.map((playlist) => playlist.id === action.id
        ? { ...playlist, songIds: [...playlist.songIds, action.songId] }
        : playlist);
    }
    case 'removeSong': {
      const target = state.find((playlist) => playlist.id === action.id);
      if (!target || !target.songIds.includes(action.songId)) return state;
      return state.map((playlist) => playlist.id === action.id
        ? { ...playlist, songIds: playlist.songIds.filter((songId) => songId !== action.songId) }
        : playlist);
    }
    default:
      return state;
  }
}
