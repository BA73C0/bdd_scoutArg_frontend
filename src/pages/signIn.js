import React from 'react';
import BasicForm from '../components/basicForm/basicForm';

const SignInPage = () => {
  const handleSignIn = (formData) => {
    const { username, password } = formData;
    console.log('Iniciando sesion con con:', username, password);
  };

  const fields = [
    { name: 'username', label: 'Nombre de usuario', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  return (
    <div className="app-container">
      <div className="form-window">
        <h2>Iniciar sesión</h2>
        <BasicForm fields={fields} onSubmit={handleSignIn} />
        <p>Todavía no estás registrado? <a href="/sign-up" className="link">Registrarse</a></p>
      </div>
    </div>
  );
};

export default SignInPage;
