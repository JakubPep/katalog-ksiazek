import React, { useEffect, useState } from 'react';
import { FaSearch, FaWifi } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import bookService from '../services/bookService';
import OfflineStorageService from '../services/offlineStorage';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OfflineMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
`;

function SearchPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
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
    if (isOffline) {
      return;
    }

    try {
      setLoading(true);
      const results = await bookService.searchBooks(query);
      setBooks(results);
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewedBooks = OfflineStorageService.getViewedBooks();

  return (
    <PageContainer>
      <SearchHeader>
        <PageTitle>
          <FaSearch /> Katalog książek
        </PageTitle>
        <SearchBar onSearch={handleSearch} disabled={isOffline} />
      </SearchHeader>

      {isOffline && (
        <OfflineMessage>
          <FaWifi style={{ marginRight: '10px' }} />
          Brak połączenia internetowego. Wyszukiwanie niedostępne.
        </OfflineMessage>
      )}

      {isOffline ? (
        <section>
          <SectionTitle>Ostatnio oglądane</SectionTitle>
          {viewedBooks.length === 0 ? (
            <OfflineMessage>Brak ostatnio oglądanych książek</OfflineMessage>
          ) : (
            <BookGrid>
              {viewedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </BookGrid>
          )}
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
