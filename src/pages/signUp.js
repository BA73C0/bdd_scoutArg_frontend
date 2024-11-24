import React from 'react';
import SignUpWindow from '../components/signUpWindow/signUpWindow';

const SignUp = () => {
  // Función que maneja el envío del formulario de registro
  const handleSignUp = (username, password) => {
    // Aquí puedes agregar lógica para registrar al usuario (por ejemplo, enviar una solicitud a la API)
  };

  return (
    <div className="app-container">
      <SignUpWindow isSignUp={true} onSubmit={handleSignUp}/>  {/* Llama al componente SignUpWindow */} 
    </div>
  );
};

export default SignUp;