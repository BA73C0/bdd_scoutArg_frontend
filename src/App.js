import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage'
import SignIn from './pages/signIn';
import SignUp from './pages/signUp'
import Home from './pages/home'
import Team from './pages/team'; 
import Player from './pages/player'; 
import Header from './components/header/header';
import Footer from './components/footer/footer';

function App() {
  return (
    <BrowserRouter>
    {/* Agrega el Header aquí, fuera de las rutas, para que esté visible en todas las páginas */}
    <Header />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/teams" element={<Home />} />
        <Route path="/teams/:teamId/:teamName" element={<Team />} />
        <Route path="/teams/:teamName/:playerId/:playerName" element={<Player />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;