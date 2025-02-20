import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import InstallPrompt from './components/InstallPrompt';
import AuthPage from './pages/AuthPage';
import BookDetailPage from './pages/BookDetailPage';
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
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Navigation>
            <NavLink to="/">Szukaj</NavLink>
            <NavLink to="/auth">Zaloguj</NavLink>
          </Navigation>

          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
          <InstallPrompt />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
