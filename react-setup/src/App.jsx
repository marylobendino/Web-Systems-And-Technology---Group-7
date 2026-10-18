import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import './App.css';

export default function App() {
  const path = window.location.pathname;
  const isLoginPage =
    path === '/login' || path.endsWith('/login.html');

  return isLoginPage ? <Login /> : <Home />;
}