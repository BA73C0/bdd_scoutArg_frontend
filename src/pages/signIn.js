import React from 'react';
import SignUpWindow from '../components/signUpWindow/signUpWindow';  // Importa el componente SignUpWindow

const SignInPage = () => {
  // Función que maneja el inicio de sesión
  const handleSignIn = (username, password) => {
    console.log('Iniciando sesión con:', username, password);
    // Aquí puedes agregar la lógica para iniciar sesión (por ejemplo, validar con la API)
  };

  return (
    <div className="app-container">
      <SignUpWindow isSignUp={false} onSubmit={handleSignIn}/>  {/* Llama al componente SignUpWindow */}
    </div>
  );
};

export default SignInPage;