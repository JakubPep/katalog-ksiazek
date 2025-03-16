import React from 'react';
import styled from 'styled-components';
import OfflineStorageService from '../services/offlineStorage';

const NotesContainer = styled.div`
  margin-top: 20px;
`;

const NoteItem = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
`;

function BookNotesList({ bookId, notes, onNoteDeleted }) {
  const handleDelete = (noteId) => {
    OfflineStorageService.deleteBookNote(bookId, noteId);
    onNoteDeleted();
  };

  return (
    <NotesContainer>
      <h3>Moje przemyślenia</h3>
      {notes.length === 0 ? (
        <p>Jeszcze nie dodałeś żadnych przemyśleń o tej książce</p>
      ) : (
        notes.map((note) => (
          <NoteItem key={note.id}>
            <p>{note.text}</p>
            <div>
              <span>{note.date}</span>
              {note.feeling !== null && (
                <span>
                  {note.feeling
                    ? ' • 😊 Pozytywne wrażenia'
                    : ' • 😕 Mieszane wrażenia'}
                </span>
              )}
            </div>
            <DeleteButton onClick={() => handleDelete(note.id)}>
              Usuń
            </DeleteButton>
          </NoteItem>
        ))
      )}
    </NotesContainer>
  );
}

export default BookNotesList;
