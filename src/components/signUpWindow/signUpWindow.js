// src/components/SignUpWindow.js
import React, { useState } from 'react';
import './signUpWindow.css';  // Asegúrate de importar el archivo CSS

const SignUpWindow = ({ isSignUp = true, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMessage('Por favor, ingresa todos los campos.');
      return;
    }

    setErrorMessage('');
    onSubmit(username, password); 
  };

  return (
    <div className="sign-up-window">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="button-container">
          <button type="submit" className="auth-button">{isSignUp ? 'Registrar' : 'Iniciar sesión'}</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpWindow;
