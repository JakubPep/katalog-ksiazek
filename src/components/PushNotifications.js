import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const publicVapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;

function PushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Sprawdzenie wsparcia dla powiadomień
    if ('Notification' in window && 'serviceWorker' in navigator) {
      // Sprawdzenie aktualnego stanu subskrypcji
      checkSubscriptionStatus();
    } else {
      console.log('Powiadomienia push nie są wspierane');
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      setIsSubscribed(true);
      setSubscription(existingSubscription);
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'ВАША_ПУБЛИЧНАЯ_VAPID_КЛАВИША'
        ),
      });

      setIsSubscribed(true);
      setSubscription(subscription);

      // Tutaj będzie logika wysyłania subskrypcji na serwer
      console.log('Subskrypcja:', JSON.stringify(subscription));
    } catch (error) {
      console.error('Błąd subskrypcji:', error);
    }
  };

  const unsubscribeUser = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setIsSubscribed(false);
      setSubscription(null);
    }
  };

  // Funkcja konwertująca klucz VAPID
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div>
      {!isSubscribed ? (
        <NotificationButton
          onClick={() => {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                subscribeUser();
              }
            });
          }}
        >
          Włącz powiadomienia
        </NotificationButton>
      ) : (
        <NotificationButton onClick={unsubscribeUser}>
          Wyłącz powiadomienia
        </NotificationButton>
      )}
    </div>
  );
}

export default PushNotifications;
