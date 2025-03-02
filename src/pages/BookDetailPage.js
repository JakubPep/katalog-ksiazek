import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AudioRecorder from '../components/AudioRecorder';
import bookService from '../services/bookService';

const DetailContainer = styled.div`
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

const BookCover = styled.img`
  max-width: 300px;
  height: 400px;
  object-fit: cover;
  margin-right: 2rem;
`;

const BookInfo = styled.div`
  flex-grow: 1;
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

function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(
    'https://via.placeholder.com/300x400'
  );

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await bookService.getBookDetails(id);
        setBook(bookDetails);
        if (bookDetails?.coverImage) {
          setCoverImage(bookDetails.coverImage);
        }
      } catch (error) {
        console.error('Błąd podczas ładowania szczegółów książki:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

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
    // Tutaj późnej dodamy logikę wysyłania nagrania na serwer
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
      </BookInfo>
      {book && (
        <AudioRecorder
          bookId={book.id}
          onRecordingComplete={handleRecordingComplete}
        />
      )}
    </DetailContainer>
  );
}

export default BookDetailPage;
