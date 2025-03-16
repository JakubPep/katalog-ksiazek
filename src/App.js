import React, { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import BookDetailPage from './pages/BookDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f4f4f4',
    text: '#333',
  },
};

const Navigation = styled.nav`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.primary};

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 10px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 5px;
  }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const InstallBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  animation: ${slideUp} 0.5s ease-out;
`;

const InstallButton = styled.button`
  background-color: white;
  color: #3498db;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-right: 10px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

function CustomInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już wcześniej zdecydował, że nie chce widzieć
    const neverShowInstall = localStorage.getItem('neverShowInstallPrompt');
    if (neverShowInstall) {
      setNeverShow(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Pokaż prompt tylko jeśli użytkownik nie wybrał "Nie pokazuj więcej"
      if (!neverShowInstall) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === 'accepted') {
        console.log('Użytkownik zainstalował aplikację');
      }

      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('neverShowInstallPrompt', 'true');
    setShowPrompt(false);
    setNeverShow(true);
  };

  if (!showPrompt || neverShow) return null;

  return (
    <InstallBanner>
      <div>
        <span>Dodaj Book Catalog do ekranu głównego</span>
        <InstallButton onClick={handleInstallClick}>Zainstaluj</InstallButton>
        <CloseButton onClick={handleNeverShowAgain}>
          Nie pokazuj więcej
        </CloseButton>
        <CloseButton onClick={handleClosePrompt}>Zamknij</CloseButton>
      </div>
    </InstallBanner>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Navigation>
            <NavLink to="/">Szukaj</NavLink>
            <NavLink to="/favorites">Ulubione</NavLink>
          </Navigation>

          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          <CustomInstallPrompt />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
