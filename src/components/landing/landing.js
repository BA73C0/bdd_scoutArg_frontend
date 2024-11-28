import React from 'react';
import "./landing.css"
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="landing">
      <div className="title-container">
        <h1> ScoutArg </h1>
      </div>
      <div className="landing-home">
        <button onClick={handleSignIn} className="landing-home-button">Iniciar sesión</button>
        <div className="logo-container">
          <img
            src="../logo512.png"
            alt="Logo"
          />
        </div>
        <button onClick={handleSignUp} className="landing-home-button">Registrarse</button>
      </div>
      <div className="text-container">
        <p> La mejor plataforma para la seguir el ascenso de tu equipo favorito. </p>
      </div>
    </div>
  );
}

export default Landing;
