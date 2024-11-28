import { API_URL } from '../utils';
import React, { useState } from 'react';
import BasicForm from '../components/basicForm/basicForm';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const handleSignUp = async (formData) => {
    const { username, email, password, confirm_password } = formData;

    if (password !== confirm_password) {
      setError('Las contraseñas no coinciden');
      return
    }

    const json = {};

    json["email"] = email;
    json["name"] = username;
    json["password"] = password;

    try {
      const registerReponse = await fetch(`${API_URL}/users` , {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (!registerReponse.ok) {
        throw new Error('Error registrando usuario');
      }

      await registerReponse.json();
    } catch (error) {
      setError('Error en el registro');
    } finally {
      navigate('/teams');
    }

  };

  const fields = [
    { name: 'username', label: 'Nombre de usuario', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
    { name: 'confirm_password', label: 'Confirmar contraseña', type: 'password', required: true },
  ];

  return (
    <div className="app-container">
      <div className="form-window">
        <h2>Registrarse</h2>
        <BasicForm fields={fields} onSubmit={handleSignUp} />
        {error && <p style={{ color: 'red', maxWidth: '255px', textAlign: 'center', margin: 'auto', marginTop: '10px' }}>{error}</p>}
        <p>Ya estás registrado? <a href="/sign-in" className="link">Iniciar sesión</a></p>
      </div>
    </div>
  );
};

export default SignUpPage;
