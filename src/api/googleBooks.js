const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

export const searchBooks = async (query) => {
  const response = await fetch(`${API_URL}${query}`);
  const data = await response.json();
  return data.items;
};

export default searchBooks;