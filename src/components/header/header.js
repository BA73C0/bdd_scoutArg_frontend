import React, { useState } from 'react';
import './header.css';  // Asegúrate de importar el archivo CSS aquí
import Logo from '../logoButton/logoButton';
import { useNavigate } from 'react-router-dom';  // Para navegación

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
  const [userName, setUserName] = useState('');  // Nombre del usuario
  const navigate = useNavigate();  // Usamos navigate para redirigir
  
  // Funciones de autenticación
  const handleSignIn = () => {
    // Simula el inicio de sesión (en un caso real, se manejaría aquí la lógica de login)
    navigate("/sign-in");  // Redirigir al dashboard
  };

  const handleSignUp = () => {
    // Redirigir a la página de registro
    navigate("/sign-up");
  };

  const handleLogout = () => {
    navigate("/");  // Redirigir a la página principal
  };

  return (
    <header className="header">
      <Logo /> {/* Logo en el header */}

      {/* Mostrar botones de Sign In / Sign Up si no está autenticado */}
      {!isAuthenticated ? (
        <div className="auth-buttons">
          <button onClick={handleSignIn} className="auth-button">Sign In</button>
          <button onClick={handleSignUp} className="auth-button">Sign Up</button>
        </div>
      ) : (
        <div className="user-info">
          <span className="user-name">Welcome, {userName}</span>
          <button onClick={handleLogout} className="auth-button">Logout</button>
        </div>
      )}
    </header>
  );
}

export default Header;
