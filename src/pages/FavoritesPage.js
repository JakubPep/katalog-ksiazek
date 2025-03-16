import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import BookCard from '../components/BookCard';
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

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;

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

const BookItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  background-color: #e74c3c;
  color: white;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #666;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
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
      <PageTitle>Ulubione książki</PageTitle>
      {favoriteBooks.length === 0 ? (
        <EmptyState>
          <FaHeart size={80} color="#3498db" />
          <h2>Nie masz jeszcze ulubionych książek</h2>
          <p>Dodaj książki do ulubionych, aby móc je później przejrzeć</p>
        </EmptyState>
      ) : (
        <BookGrid>
          {favoriteBooks.map((book) => (
            <BookItemContainer key={book.id}>
              <BookCard book={book} />
              <RemoveButton onClick={() => removeFromFavorites(book.id)}>
                <FaHeart /> Usuń z ulubionych
              </RemoveButton>
            </BookItemContainer>
          ))}
        </BookGrid>
      )}
    </PageContainer>
  );
}

export default FavoritesPage;
