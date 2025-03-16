import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AudioRecorder from '../components/AudioRecorder';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import bookService from '../services/bookService';
import OfflineStorageService from '../services/offlineStorage';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const BookCover = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: cover;
  justify-self: center;

  @media (max-width: 1024px) {
    max-width: 300px;
  }
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1024px) {
    align-items: center;
    text-align: center;
  }
`;

const ReviewSection = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BookTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const BookAuthors = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
`;

const BookDescription = styled.p`
  line-height: 1.6;
`;

const FavoriteButton = styled.button`
  background-color: ${(props) => (props.isFavorite ? '#ff6b6b' : '#3498db')};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
`;

function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(
    'https://via.placeholder.com/300x400'
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  const loadReviews = () => {
    const bookReviews = OfflineStorageService.getBookReviews(id);
    setReviews(bookReviews);
  };

  useEffect(() => {
    // Dodaj wywołanie loadReviews
    loadReviews();
  }, [id]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);

        console.log('Próba pobrania książki o ID:', id);

        const bookDetails = await bookService.getBookDetails(id);

        console.log('Pobrane szczegóły książki:', bookDetails);

        if (bookDetails) {
          OfflineStorageService.saveViewedBook(bookDetails);
          setBook(bookDetails);

          if (bookDetails.coverImage) {
            setCoverImage(bookDetails.coverImage);
          }

          // Sprawdź, czy książka jest już w ulubionych
          setIsFavorite(OfflineStorageService.isFavorite(id));
        } else {
          console.log('Próba pobrania książki z offline storage');
          const viewedBooks = OfflineStorageService.getViewedBooks();
          const offlineBook = viewedBooks.find((b) => b.id === id);

          console.log('Znaleziona książka offline:', offlineBook);

          if (offlineBook) {
            setBook(offlineBook);
            if (offlineBook.coverImage) {
              setCoverImage(offlineBook.coverImage);
            }
          }
        }
      } catch (error) {
        console.error('Błąd podczas ładowania szczegółów książki:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      OfflineStorageService.removeFromFavorites(id);
    } else {
      OfflineStorageService.addToFavorites(book);
    }
    setIsFavorite(!isFavorite);
  };

  const handleCoverImageError = () => {
    setCoverImage('https://via.placeholder.com/300x400');
  };

  if (loading) {
    return <LoadingContainer>Ładowanie...</LoadingContainer>;
  }

  if (!book) {
    return <LoadingContainer>Nie znaleziono książki</LoadingContainer>;
  }

  const handleRecordingComplete = (recordingData) => {
    console.log('Nagranie zakończone:', recordingData);
  };

  return (
    <DetailContainer>
      <BookCover
        src={coverImage}
        alt={book.title}
        onError={handleCoverImageError}
      />
      <BookInfo>
        <BookTitle>{book.title}</BookTitle>
        <BookAuthors>Autor: {book.authors.join(', ')}</BookAuthors>
        <p>Wydawca: {book.publisher || 'Nieznany'}</p>
        <p>Data publikacji: {book.publishedDate || 'Brak daty'}</p>
        <p>Liczba stron: {book.pageCount || 'Nieznana'}</p>
        {book.averageRating && (
          <p>
            Ocena: {book.averageRating} / 5 ({book.ratingsCount} ocen)
          </p>
        )}
        <BookDescription>{book.description}</BookDescription>
        {book.previewLink && (
          <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
            Podgląd książki
          </a>
        )}

        <ActionContainer>
          <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite}>
            {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          </FavoriteButton>

          {book && (
            <AudioRecorder
              bookId={book.id}
              onRecordingComplete={handleRecordingComplete}
            />
          )}
        </ActionContainer>
      </BookInfo>

      <ReviewSection>
        <ReviewForm bookId={book.id} onReviewAdded={loadReviews} />
        <ReviewList
          bookId={book.id}
          reviews={reviews}
          onReviewDeleted={loadReviews}
        />
      </ReviewSection>
    </DetailContainer>
  );
}

export default BookDetailPage;
