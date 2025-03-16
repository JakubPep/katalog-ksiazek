import React, { useEffect, useState } from 'react';
import { FaBookOpen, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import AudioRecorder from '../components/AudioRecorder';
import BookNoteForm from '../components/BookNoteForm';
import BookNotesList from '../components/BookNotesList';
import bookService from '../services/bookService';
import OfflineStorageService from '../services/offlineStorage';

const PageContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const BookDescription = styled.p`
  line-height: 1.6;
  color: #333;
  margin: 1rem 0;
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const breatheAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BookHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookCover = styled.div`
  position: relative;
  perspective: 1000px;

  img {
    width: 100%;
    max-width: 400px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    transform: rotateY(-10deg);
    transition: all 0.4s ease;

    &:hover {
      transform: rotateY(0) scale(1.05);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const BookTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const BookMetadata = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const MetadataItem = styled.div`
  background: rgba(52, 152, 219, 0.1);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background-color: ${(props) => props.color || '#3498db'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${breatheAnimation} 3s infinite;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const NotesSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AudioRecordingsSection = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AudioRecordingsList = styled.div`
  margin-top: 1rem;
`;

const AudioRecordingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 10px;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
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
  const [notes, setNotes] = useState([]);
  const [audioRecordings, setAudioRecordings] = useState([]);

  const loadNotes = () => {
    const bookNotes = OfflineStorageService.getBookNotes(id);
    setNotes(bookNotes);
  };

  const loadAudioRecordings = () => {
    const recordings = OfflineStorageService.getBookAudioRecordings(id);
    setAudioRecordings(recordings);
  };

  useEffect(() => {
    loadNotes();
    loadAudioRecordings();
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
    OfflineStorageService.addAudioRecording(id, recordingData.audioBlob);
    loadAudioRecordings();
  };

  const deleteAudioRecording = (recordingId) => {
    OfflineStorageService.deleteAudioRecording(id, recordingId);
    loadAudioRecordings();
  };

  return (
    <PageContainer>
      <DetailContainer>
        <BookHeader>
          <BookCover>
            <img
              src={coverImage}
              alt={book.title}
              onError={handleCoverImageError}
            />
          </BookCover>

          <BookInfo>
            <BookTitle>{book.title}</BookTitle>
            <BookMetadata>
              <MetadataItem>
                <strong>Autor</strong>
                <p>{book.authors.join(', ')}</p>
              </MetadataItem>
              <MetadataItem>
                <strong>Wydawca</strong>
                <p>{book.publisher || 'Nieznany'}</p>
              </MetadataItem>
              <MetadataItem>
                <strong>Data publikacji</strong>
                <p>{book.publishedDate || 'Brak daty'}</p>
              </MetadataItem>
              <MetadataItem>
                <strong>Strony</strong>
                <p>{book.pageCount || 'Nieznana'}</p>
              </MetadataItem>
            </BookMetadata>

            <BookDescription>{book.description}</BookDescription>

            <ActionContainer>
              <ActionButton
                color={isFavorite ? '#e74c3c' : '#3498db'}
                onClick={toggleFavorite}
              >
                <FaHeart />{' '}
                {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              </ActionButton>

              {book.previewLink && (
                <ActionButton
                  color="#2ecc71"
                  as="a"
                  href={book.previewLink}
                  target="_blank"
                >
                  <FaBookOpen /> Podgląd książki
                </ActionButton>
              )}
            </ActionContainer>
          </BookInfo>
        </BookHeader>

        <NotesSection>
          <BookNoteForm bookId={book.id} onNoteAdded={loadNotes} />
          <BookNotesList
            bookId={book.id}
            notes={notes}
            onNoteDeleted={loadNotes}
          />
        </NotesSection>

        <AudioRecordingsSection>
          <h2>Moje nagrania</h2>
          <AudioRecorder
            bookId={book.id}
            onRecordingComplete={handleRecordingComplete}
          />
          {audioRecordings.length > 0 && (
            <AudioRecordingsList>
              {audioRecordings.map((recording) => (
                <AudioRecordingItem key={recording.id}>
                  <audio src={recording.audioUrl} controls />
                  <span>{recording.date}</span>
                  <DeleteButton
                    onClick={() => deleteAudioRecording(recording.id)}
                  >
                    Usuń
                  </DeleteButton>
                </AudioRecordingItem>
              ))}
            </AudioRecordingsList>
          )}
        </AudioRecordingsSection>
      </DetailContainer>
    </PageContainer>
  );
}

export default BookDetailPage;
