import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import PushNotifications from '../components/PushNotifications';
import RegisterForm from '../components/RegisterForm';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
      <PushNotifications />
    </div>
  );
}

export default AuthPage;
