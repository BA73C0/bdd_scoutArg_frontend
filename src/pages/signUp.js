import React from 'react';
import SignUpWindow from '../components/signUpWindow/signUpWindow';
import { API_URL } from '../utils';
//Vamos a traer la función handleSignIn para poder llamarla en el handleSignUp
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  // Función que maneja el envío del formulario de registro
  const handleSignUp = async (username, password) => {
    // Aquí puedes agregar lógica para registrar al usuario (por ejemplo, enviar una solicitud a la API)
    console.log(`Usuario: ${username}`); // Muestra el nombre de usuario en la consola
    console.log(`Contraseña: ${password}`); // Muestra la contraseña en la consola

    const json = {};

    json["email"] = username;
    json["name"] = "Franco";
    json["password"] = password;


    try {
      const registerReponse = await fetch(`${API_URL}users` , {
        method: 'POST',
        
        body: JSON.stringify(json),
      
      headers: {
        'Content-Type': 'application/json',
      },

      });
      console.log(await registerReponse.json());
      
      if (!registerReponse.ok) {
        throw new Error('Error en el registro');
      } else {
        console.log('Usuario registrado correctamente');
        navigate('/sign-in', { state: { username, password } });
      } 
  } catch (error) {
    console.error('Error en el registro:', error);
  }

};

  return (
    <div className="app-container">
      <SignUpWindow isSignUp={true} onSubmit={handleSignUp}/>  {/* Llama al componente SignUpWindow */} 
    </div>
  );
};

export default SignUp;