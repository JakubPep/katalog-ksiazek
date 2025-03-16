import React, { useState } from 'react';
import styled from 'styled-components';
import OfflineStorageService from '../services/offlineStorage';

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  min-height: 100px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const RatingButton = styled.button`
  background-color: ${(props) =>
    props.positive
      ? props.selected
        ? 'green'
        : '#2ecc71'
      : props.selected
        ? 'red'
        : '#e74c3c'};
  color: white;
  border: none;
  padding: 10px;
  margin: 0 10px;
  border-radius: 50%;
  cursor: pointer;
`;

function ReviewForm({ bookId, onReviewAdded }) {
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nickname || !comment || rating === null) {
      alert('Proszę wypełnić wszystkie pola');
      return;
    }

    const review = {
      nickname,
      comment,
      rating,
      date: new Date().toLocaleString(),
    };

    OfflineStorageService.addReview(bookId, review);
    onReviewAdded();

    // Resetuj formularz
    setNickname('');
    setComment('');
    setRating(null);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Twój pseudonim"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <TextArea
          placeholder="Twoja recenzja"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <RatingContainer>
          <RatingButton
            type="button"
            positive={true}
            selected={rating === true}
            onClick={() => setRating(true)}
          >
            👍
          </RatingButton>
          <RatingButton
            type="button"
            positive={false}
            selected={rating === false}
            onClick={() => setRating(false)}
          >
            👎
          </RatingButton>
        </RatingContainer>

        <Button type="submit">Dodaj recenzję</Button>
      </form>
    </FormContainer>
  );
}

export default ReviewForm;
