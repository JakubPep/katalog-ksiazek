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
  static addBookNote(bookId, note) {
    const notes = this.getBookNotes(bookId);

    // Dodaj unikalny identyfikator notatki
    note.id = Date.now();
    note.date = new Date().toLocaleString();
    notes.push(note);

    localStorage.setItem(`notes_${bookId}`, JSON.stringify(notes));
  }

  static getBookNotes(bookId) {
    return JSON.parse(localStorage.getItem(`notes_${bookId}`) || '[]');
  }

  static deleteBookNote(bookId, noteId) {
    const notes = this.getBookNotes(bookId);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    localStorage.setItem(`notes_${bookId}`, JSON.stringify(updatedNotes));
  }

  // Metody do zarządzania nagraniami audio
  static addAudioRecording(bookId, audioBlob) {
    const recordings = this.getBookAudioRecordings(bookId);

    const audioBase64 =
      audioBlob instanceof Blob ? URL.createObjectURL(audioBlob) : audioBlob;

    const recording = {
      id: Date.now(),
      audioUrl: audioBase64,
      date: new Date().toLocaleString(),
    };

    recordings.push(recording);
    localStorage.setItem(
      `audioRecordings_${bookId}`,
      JSON.stringify(recordings)
    );
  }

  static getBookAudioRecordings(bookId) {
    return JSON.parse(
      localStorage.getItem(`audioRecordings_${bookId}`) || '[]'
    );
  }

  static deleteAudioRecording(bookId, recordingId) {
    const recordings = this.getBookAudioRecordings(bookId);
    const updatedRecordings = recordings.filter(
      (rec) => rec.id !== recordingId
    );

    localStorage.setItem(
      `audioRecordings_${bookId}`,
      JSON.stringify(updatedRecordings)
    );
  }
}

export default OfflineStorageService;
