import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const RecorderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const AudioButton = styled.button`
  background-color: ${(props) => (props.recording ? 'red' : '#3498db')};
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
`;

function AudioRecorder({ bookId, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        // Opcjonalnie: wysłanie nagrania na serwer
        onRecordingComplete({
          bookId,
          audioBlob,
          audioUrl,
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

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
  };

  return (
    <div>
      <RecorderContainer>
        {!isRecording ? (
          <AudioButton onClick={startRecording}>Nagraj recenzję</AudioButton>
        ) : (
          <AudioButton recording={true} onClick={stopRecording}>
            Zatrzymaj nagrywanie
          </AudioButton>
        )}

        {audioURL && (
          <AudioControls>
            <audio src={audioURL} controls />
            <AudioButton onClick={clearRecording}>Usuń</AudioButton>
          </AudioControls>
        )}
      </RecorderContainer>
    </div>
  );
}

export default AudioRecorder;
