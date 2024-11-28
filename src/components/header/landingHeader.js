import React, { useState } from 'react';
import './header.css';
import Logo from '../logoButton/logoButton';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <header className="header">
      <Logo />
      <div className="auth-buttons">
        <button onClick={handleSignIn} className="auth-button">Sign In</button>
        <button onClick={handleSignUp} className="auth-button">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
