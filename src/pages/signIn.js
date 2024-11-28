import React, { useState } from 'react';
import BasicForm from '../components/basicForm/basicForm';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils';

const SignInPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const getUser = async () => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));

    const response = await fetch(`${API_URL}/users/${currentUser.id}`)
    if (!response.ok) {
      throw new Error('Error al obtener el usuario');
    }
    const user = await response.json();

    localStorage.setItem('current_user_data', JSON.stringify(user));
  }


  const handleSignIn = async (formData) => {
    const { email, password } = formData;

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    const json = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const access_token = await response.json();

      if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
      } else {
        localStorage.setItem('current_user', JSON.stringify(access_token));

        await getUser();
        navigate('/teams');
      }
    } catch (error) {
      setError('Usuario no registrado');
    }
  };

  const fields = [
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  return (
    <div className="app-container">
      <div className="form-window">
        <h2>Iniciar sesión</h2>
        <BasicForm fields={fields} onSubmit={handleSignIn} />
        {error && <p style={{ color: 'red', maxWidth: '255px', textAlign: 'center', margin: 'auto', marginTop: '10px' }}>{error}</p>}
        <p>Todavía no estás registrado? <a href="/sign-up" className="link">Registrarse</a></p>
      </div>
    </div>
  );
};

export default SignInPage;
