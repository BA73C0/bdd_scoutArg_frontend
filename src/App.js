import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage'
import SignIn from './pages/signIn';
import SignUp from './pages/signUp'
import Home from './pages/home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;