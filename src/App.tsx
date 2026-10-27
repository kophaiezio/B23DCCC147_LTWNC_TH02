const BUILD_TAG = "mz-4073";
import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LibraryPage } from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';
import './styles.css';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

function Navigation() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <NavLink className="wordmark" to="/" aria-label="Âm sắc — về thư viện">
        <span className="wordmark-icon" aria-hidden="true">a.</span>
        <span>âm sắc<span className="wordmark-period">/</span></span>
      </NavLink>
      <nav className="primary-nav" aria-label="Điều hướng chính">
        <NavLink to="/" end>Thư viện</NavLink>
        <NavLink to="/favorites">Yêu thích</NavLink>
        <NavLink to="/playlists" end>Playlist</NavLink>
      </nav>
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        <span className="theme-indicator" aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span>
        {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
      </button>
    </header>
  );
}

function AppLayout() {
  return (
    <div className="app-shell" data-build-tag={BUILD_TAG}>
      <Navigation />
      <Suspense fallback={<p className="loading-state">Đang tải trang...</p>}>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="*" element={<main className="page missing-playlist"><p className="section-label">404 / KHÔNG TÌM THẤY</p><h1>Trang này không tồn tại.</h1><NavLink className="text-link" to="/">Về thư viện <span aria-hidden="true">↗</span></NavLink></main>} />
        </Routes>
      </Suspense>
      <PlayerBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <AppLayout />
      </PlaylistProvider>
    </ThemeProvider>
  );
}
