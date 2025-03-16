class OfflineStorageService {
  // Ulubione książki
  static addToFavorites(book) {
    const favorites = this.getFavoriteBooks();

    const isBookAlreadyFavorite = favorites.some(
      (favBook) => favBook.id === book.id
    );

    if (!isBookAlreadyFavorite) {
      favorites.push(book);
      localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
    }
  }

  static getFavoriteBooks() {
    return JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
  }

  static removeFromFavorites(bookId) {
    const favorites = this.getFavoriteBooks();
    const updatedFavorites = favorites.filter((book) => book.id !== bookId);

    localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
  }

  static isFavorite(bookId) {
    const favorites = this.getFavoriteBooks();
    return favorites.some((book) => book.id === bookId);
  }

  // Dodajemy metodę dla ostatnio oglądanych książek
  static saveViewedBook(book) {
    const viewedBooks = this.getViewedBooks();

    // Usuń duplikaty, dodaj na początek
    const filteredBooks = viewedBooks.filter((b) => b.id !== book.id);
    filteredBooks.unshift(book);

    // Ogranicz do 10 ostatnich książek
    localStorage.setItem(
      'viewedBooks',
      JSON.stringify(filteredBooks.slice(0, 10))
    );
  }

  static getViewedBooks() {
    return JSON.parse(localStorage.getItem('viewedBooks') || '[]');
  }

  // Metody do zarządzania recenzjami
  static addReview(bookId, review) {
    const reviews = this.getBookReviews(bookId);

    // Dodaj unikalny identyfikator recenzji
    review.id = Date.now();
    reviews.push(review);

    localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
  }

  static getBookReviews(bookId) {
    return JSON.parse(localStorage.getItem(`reviews_${bookId}`) || '[]');
  }

  static deleteReview(bookId, reviewId) {
    const reviews = this.getBookReviews(bookId);
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);

    localStorage.setItem(`reviews_${bookId}`, JSON.stringify(updatedReviews));
  }
}

export default OfflineStorageService;
