import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import OfflineStorageService from '../services/offlineStorage';

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const AudioButton = styled.button`
  background-color: ${(props) => (props.recording ? 'red' : '#3498db')};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const AudioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AudioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
`;

function AudioRecorder({ bookId, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const loadRecordings = () => {
    const recordings = OfflineStorageService.getBookAudioRecordings(bookId);
    setAudioRecordings(recordings);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });

        OfflineStorageService.addAudioRecording(bookId, audioBlob);
        loadRecordings();

        onRecordingComplete({
          bookId,
          audioBlob,
          audioUrl: URL.createObjectURL(audioBlob),
        });

        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Błąd podczas nagrywania:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = (recordingId) => {
    OfflineStorageService.deleteAudioRecording(bookId, recordingId);
    loadRecordings();
  };

  React.useEffect(() => {
    loadRecordings();
  }, [bookId]);

  return (
    <RecorderContainer>
      {!isRecording ? (
        <AudioButton onClick={startRecording}>Nagraj audio</AudioButton>
      ) : (
        <AudioButton recording={true} onClick={stopRecording}>
          Zatrzymaj nagrywanie
        </AudioButton>
      )}

      {audioRecordings.length > 0 && (
        <AudioList>
          {audioRecordings.map((recording) => (
            <AudioItem key={recording.id}>
              <audio src={recording.audioUrl} controls />
              <span>{recording.date}</span>
              <DeleteButton onClick={() => deleteRecording(recording.id)}>
                Usuń
              </DeleteButton>
            </AudioItem>
          ))}
        </AudioList>
      )}
    </RecorderContainer>
  );
}

export default AudioRecorder;
