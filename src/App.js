import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import InstallPrompt from './components/InstallPrompt';
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
          <InstallPrompt />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
