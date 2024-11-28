import React from 'react';
import BasicForm from '../components/basicForm/basicForm';

const SignUpPage = () => {
  const handleSignUp = (formData) => {
    const { username, email, password } = formData;
    console.log('Creando user con:', username, email, password);
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
        <p>Ya estás registrado? <a href="/sign-in" className="link">Iniciar sesión</a></p>
      </div>
    </div>
  );
};

export default SignUpPage;
