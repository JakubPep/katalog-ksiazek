import React from 'react';
import styled from 'styled-components';
import OfflineStorageService from '../services/offlineStorage';

const ReviewContainer = styled.div`
  margin-top: 20px;
`;

const ReviewItem = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

function ReviewList({ bookId, reviews, onReviewDeleted }) {
  const handleDelete = (reviewId) => {
    OfflineStorageService.deleteReview(bookId, reviewId);
    onReviewDeleted();
  };

  return (
    <ReviewContainer>
      <h3>Recenzje</h3>
      {reviews.map((review, index) => (
        <ReviewItem key={index}>
          <ReviewHeader>
            <strong>{review.nickname}</strong>
            <span>{review.date}</span>
          </ReviewHeader>
          <p>{review.comment}</p>
          <div>{review.rating ? '👍 Polecam' : '👎 Nie polecam'}</div>
        </ReviewItem>
      ))}
    </ReviewContainer>
  );
}

export default ReviewList;
