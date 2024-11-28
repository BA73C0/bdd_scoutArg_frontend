import React, { useEffect } from 'react';
import SignUpWindow from '../components/signUpWindow/signUpWindow';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../utils';

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera username y password si están disponibles en la navegación
  const { username, password } = location.state || {};

  const handleSignIn = async (username, password) => {
    console.log('Iniciando sesión con:', username, password);

    const json = {
      email: username,
      password: password,
    };

    try {
      const response = await fetch(`${API_URL}users/login`, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
      } else {
        console.log('Inicio de sesión exitoso');
        navigate('/teams');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  };

  // Si username y password fueron pasados, intenta iniciar sesión automáticamente
  useEffect(() => {
    if (username && password) {
      handleSignIn(username, password);
    }
  }, [username, password]);

  return (
    <div className="app-container">
      <SignUpWindow isSignUp={false} onSubmit={handleSignIn} />
    </div>
  );
};

export default SignInPage;
