import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchBooks } from '../api/googleBooks';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  // Funkcja pomocnicza do pobrania query z adresu URL
  const getQueryFromUrl = () => {
    return new URLSearchParams(location.search).get('query');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const query = getQueryFromUrl();
      if (query) {
        const books = await searchBooks(query);
        setResults(books);
        // wyświetlenie wyników wyszukiwania w konsoli
        console.log(books);
      }
    };
    fetchBooks();
  }, [location]);

  return (
    <div>
      <h1>Wyniki wyszukiwania</h1>
      <div>
        {results && results.length > 0 ? (
          results.map((book) => (
            <div key={book.id}>
              <h2>{book.volumeInfo.title}</h2>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>Brak wyników wyszukiwania</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
