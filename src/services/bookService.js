import axios from 'axios';

const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

class BookService {
  cleanBookDescription(description) {
    if (!description) return 'Brak opisu';

    // Usuwanie tagów HTML
    let cleanText = description
      .replace(/<\/?b>/g, '') // usuwanie pogrubienia
      .replace(/<\/?i>/g, '') // usuwanie kursywy
      .replace(/<[^>]*>/g, '') // usuwanie wszystkich innych tagów HTML
      .replace(/&quot;/g, '"') // zamiana encji HTML na znaki
      .replace(/&#39;/g, "'");

    // Opcjonalnie: ogranicz długość opisu
    if (cleanText.length > 1000) {
      cleanText = cleanText.substring(0, 1000) + '...';
    }

    return cleanText;
  }

  async searchBooks(query, maxResults = 20) {
    try {
      const response = await axios.get(GOOGLE_BOOKS_API_BASE_URL, {
        params: {
          q: query,
          maxResults: maxResults,
        },
      });

      return response.data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Nieznany autor'],
        description: this.cleanBookDescription(item.volumeInfo.description),
        coverImage: this.getBestCoverImage(item.volumeInfo.imageLinks),
        publishedDate: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
      }));
    } catch (error) {
      console.error('Błąd podczas wyszukiwania książek:', error);
      return [];
    }
  }

  async getBookDetails(bookId) {
    try {
      console.log('Pobieranie szczegółów książki o ID:', bookId);
      const response = await axios.get(
        `${GOOGLE_BOOKS_API_BASE_URL}/${bookId}`
      );

      console.log('Odpowiedź API:', response.data);

      if (!response.data) {
        console.error('Brak danych dla książki');
        return null;
      }

      const item = response.data;

      // Dodatkowa walidacja danych
      if (!item.volumeInfo) {
        console.error('Brak informacji o woluminie');
        return null;
      }

      return {
        id: item.id,
        title: item.volumeInfo.title || 'Tytuł nieznany',
        authors: item.volumeInfo.authors || ['Nieznany autor'],
        description: this.cleanBookDescription(item.volumeInfo.description),
        coverImage: this.getBestCoverImage(item.volumeInfo.imageLinks),
        publishedDate: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
        publisher: item.volumeInfo.publisher,
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        previewLink: item.volumeInfo.previewLink,
      };
    } catch (error) {
      console.error('Szczegółowy błąd podczas pobierania książki:', error);

      // Dokładniejsze logowanie błędu
      if (error.response) {
        // Błąd odpowiedzi serwera
        console.error('Dane błędu:', error.response.data);
        console.error('Status błędu:', error.response.status);
      } else if (error.request) {
        // Błąd żądania
        console.error('Błąd żądania:', error.request);
      } else {
        // Inny błąd
        console.error('Błąd:', error.message);
      }

      return null;
    }
  }

  getBestCoverImage(imageLinks) {
    // Jeśli imageLinks nie istnieje, zwróć placeholder
    if (!imageLinks) {
      return 'https://via.placeholder.com/150x200';
    }

    // Preferuj thumbnail, jeśli nie ma, użyj smallThumbnail
    return (
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail ||
      'https://via.placeholder.com/150x200'
    );
  }
}

export default new BookService();
