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
      const response = await axios.get(
        `${GOOGLE_BOOKS_API_BASE_URL}/${bookId}`
      );
      const item = response.data;

      return {
        id: item.id,
        title: item.volumeInfo.title,
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
      console.error('Błąd podczas pobierania szczegółów książki:', error);
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
