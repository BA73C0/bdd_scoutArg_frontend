import React from 'react';
import { Link } from 'react-router-dom';  // Importar Link de react-router-dom

const Logo = () => {
    return (
    <div className="logo-container">
      <Link to="/teams" className="logo-link">
        <img src="logo512.png" alt="Logo" className="logo" /> {/* Asegúrate de tener el logo en el directorio correcto */}
      </Link>
    </div>
  );
}

export default Logo;