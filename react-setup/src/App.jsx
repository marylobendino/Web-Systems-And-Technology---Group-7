
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Categories from './pages/categories.jsx';
import Stores from './pages/stores.jsx';
import BuzzFeed from './pages/BuzzFeed.jsx';
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const isLoginPage = path === '/login' || path === '/signup' || path.endsWith('/login.html') || path.endsWith('/signup.html');

  if (
    path === '/categories' || path.endsWith('/categories.html')) {
    return <Categories />;
  }

  if (path === '/stores' || path.endsWith('/stores.html')) {
    return <Stores />;
  }

  if (path === '/buzzfeed' || path.endsWith('/BuzzFeed.html') ||path.endsWith('/buzzfeed.html')
  ) {
    return <BuzzFeed />;
  }

  return isLoginPage ? <Login /> : <Home />;
}