import React from 'react';
import "./landing.css"

function Landing() {
  return (
    <div className="landing">
      {/* Logo */}
      <div className="logo-container">
        <img
          src="../logo512.png"
          alt="Logo"
          className="logo-inicio"
        />
      </div>

      {/* Texto de presentación */}
      <div className="text-container">
        <p>
          Equipos del Ascenso. <a href="/teams" className="link">Clic aquí</a>
        </p>
      </div>
    </div>
  );;
}

export default Landing;