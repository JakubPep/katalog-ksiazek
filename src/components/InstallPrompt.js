import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const InstallBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const InstallButton = styled.button`
  background-color: white;
  color: #3498db;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
`;

function InstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === 'accepted') {
        console.log('Użytkownik zainstalował aplikację');
      }

      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <InstallBanner>
      <span>Dodaj BookCatalog do ekranu głównego</span>
      <InstallButton onClick={handleInstallClick}>Zainstaluj</InstallButton>
    </InstallBanner>
  );
}

export default InstallPrompt;
