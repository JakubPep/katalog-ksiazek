import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import bookService from '../services/bookService';
import OfflineStorageService from '../services/offlineStorage';

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
`;

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.25rem;
  }
`;

const OfflineMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
`;

function SearchPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Sprawdzenie połączenia internetowego
    const checkOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const handleSearch = async (query) => {
    // Jeśli offline, nie pozwalaj na wyszukiwanie
    if (isOffline) {
      return;
    }

    try {
      const results = await bookService.searchBooks(query);
      setBooks(results);
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
    }
  };

  const viewedBooks = OfflineStorageService.getViewedBooks();

  return (
    <PageContainer>
      {isOffline && (
        <OfflineMessage>
          Brak połączenia internetowego. Wyszukiwanie niedostępne.
        </OfflineMessage>
      )}
      <SearchBar onSearch={handleSearch} disabled={isOffline} />

      {isOffline ? (
        <section>
          <h2>Ostatnio oglądane</h2>
          <BookGrid>
            {viewedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
        </section>
      ) : (
        <BookGrid>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </BookGrid>
      )}
    </PageContainer>
  );
}

export default SearchPage;
