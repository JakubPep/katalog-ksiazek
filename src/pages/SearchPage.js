import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import bookService from '../services/bookService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

function SearchPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query) {
      searchBooks(query);
    }
  }, [query]);

  const searchBooks = async (searchQuery) => {
    setLoading(true);
    try {
      const results = await bookService.searchBooks(searchQuery);
      setBooks(results);
    } catch (error) {
      console.error('Błąd podczas wyszukiwania:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SearchBar onSearch={setQuery} />
      {loading ? (
        <LoadingMessage>Ładowanie...</LoadingMessage>
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
