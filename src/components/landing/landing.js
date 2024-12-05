import React from 'react';
import "./landing.css"
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../supabaseContext';

function Landing() {
  const { logout } = useSupabase();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('current_user_data'));
  if (user) {
    logout();
  }
  
  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="landing">
      <div className="landing-home">
        <button onClick={handleSignIn} className="landing-home-button">Iniciar sesión</button>
        <div className="logo-container">
          <img
            src="../ScoutArg.png"
            alt="Logo"
          />
        </div>
        <button onClick={handleSignUp} className="landing-home-button">Registrarse</button>
      </div>
      <div className="text-container">
        <p> La mejor plataforma para seguir el ascenso de tu equipo favorito. </p>
      </div>
    </div>
  );
}

export default Landing;
