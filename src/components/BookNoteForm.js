import React, { useState } from 'react';
import styled from 'styled-components';
import OfflineStorageService from '../services/offlineStorage';

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  min-height: 150px;
  resize: vertical;
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

function BookNoteForm({ bookId, onNoteAdded }) {
  const [note, setNote] = useState('');
  const [feeling, setFeeling] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!note) {
      alert('Wpisz swoje przemyślenia');
      return;
    }

    const bookNote = {
      text: note,
      feeling,
    };

    OfflineStorageService.addBookNote(bookId, bookNote);
    onNoteAdded();

    // Resetuj formularz
    setNote('');
    setFeeling(null);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder="Moje przemyślenia o książce..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <RatingContainer>
          <RatingButton
            type="button"
            positive={true}
            selected={feeling === true}
            onClick={() => setFeeling(true)}
          >
            😊 Pozytywne wrażenia
          </RatingButton>
          <RatingButton
            type="button"
            positive={false}
            selected={feeling === false}
            onClick={() => setFeeling(false)}
          >
            😕 Mieszane wrażenia
          </RatingButton>
        </RatingContainer>

        <Button type="submit">Zapisz przemyślenia</Button>
      </form>
    </FormContainer>
  );
}

export default BookNoteForm;
