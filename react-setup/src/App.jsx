
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Categories from './pages/categories.jsx';
import Stores from './pages/stores.jsx';
import BuzzFeed from './pages/BuzzFeed.jsx';
import './App.css';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const isLoginPage = path === '/login' || path.endsWith('/login.html');

  if (
    path === '/categories' || path.endsWith('/categories.html')) {
    return <Categories />;
  }

  if (path === '/stores' || path.endsWith('/stores.html')) {
    return <Stores />;
  }

  if (path === '/buzzfeed' || path.endsWith('/BuzzFeed.html') ||path.endsWith('/buzzfeed.tml')
  ) {
    return <BuzzFeed />;
  }

  return isLoginPage ? <Login /> : <Home />;
}