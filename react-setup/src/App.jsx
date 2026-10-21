
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Categories from './pages/categories.jsx';
import './App.css';

export default function App() {
  const path = window.location.pathname;
  const isLoginPage =
    path === '/login' || path.endsWith('/login.html');

  if (path === '/categories') {
    return <Categories />;
  }

  return isLoginPage ? <Login /> : <Home />;
}
