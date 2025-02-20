import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const BookImage = styled.img`
  max-width: 150px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

const BookTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const BookAuthor = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

function BookCard({ book }) {
  const [imageSrc, setImageSrc] = useState(book.coverImage);

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/150x200');
  };
  return (
    <Link to={`/book/${book.id}`}>
      <Card>
        <BookImage
          src={book.coverImage}
          alt={book.title}
          onError={handleImageError}
        />
        <BookTitle>{book.title}</BookTitle>
        <BookAuthor>{book.authors.join(', ')}</BookAuthor>
      </Card>
    </Link>
  );
}

export default BookCard;
