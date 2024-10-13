import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Przekierowanie na stronę SearchResults z zapytaniem
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div>
      <h1>Katalog Książek</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Szukaj książki..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Szukaj</button>
      </form>
    </div>
  );
};

export default Home;
