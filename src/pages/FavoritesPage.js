import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import OfflineStorageService from '../services/offlineStorage';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const books = OfflineStorageService.getFavoriteBooks();
    setFavoriteBooks(books);
  }, []);

  const removeFromFavorites = (bookId) => {
    OfflineStorageService.removeFromFavorites(bookId);
    const updatedFavorites = favoriteBooks.filter((book) => book.id !== bookId);
    setFavoriteBooks(updatedFavorites);
  };

  return (
    <PageContainer>
      <h1>Ulubione książki</h1>
      {favoriteBooks.length === 0 ? (
        <EmptyState>Nie masz jeszcze ulubionych książek</EmptyState>
      ) : (
        <BookGrid>
          {favoriteBooks.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
              <button onClick={() => removeFromFavorites(book.id)}>
                Usuń z ulubionych
              </button>
            </div>
          ))}
        </BookGrid>
      )}
    </PageContainer>
  );
}

export default FavoritesPage;
