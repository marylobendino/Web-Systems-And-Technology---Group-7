import { useState } from 'react';

export default function Header({
  activePage = 'categories',
  searchValue,
  onSearchChange
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Get the logged-in user's information
  const [user] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('kumaritesUser') || 'null'
      );
    } catch {
      return null;
    }
  });

  const isControlledSearch = typeof onSearchChange === 'function';

  function handleSearch(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('searchInput') || '').trim();

    if (query && !isControlledSearch) {
      alert(`Search functionality will be connected next. Search: ${query}`);
    }
  }

  return (
    <header className="navbar">
      {/* KuMarites Logo */}
      <div className="logo">
        <a href="/">
          <img
            src="/Images/BuzzFeed%20Images/Kumarites%20Logo.png"
            alt="KuMarites"
          />
        </a>
        <p>Real Finds. Real People. A More Sulit You.</p>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="primary-navigation-panel"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="primary-navigation-panel"
        className={`navbar-collapse${menuOpen ? ' is-open' : ''}`}
      >
      {/* Main Navigation */}
      <nav
        className="main-navigation"
        aria-label="Main navigation"
      >
        <a
          href="/"
          onClick={() => setMenuOpen(false)}
          className={activePage === 'home' ? 'active' : undefined}
          aria-current={activePage === 'home' ? 'page' : undefined}
        >
          Home
        </a>
        <a
          href="/buzzfeed"
          onClick={() => setMenuOpen(false)}
          className={activePage === 'buzzfeed' ? 'active' : undefined}
          aria-current={activePage === 'buzzfeed' ? 'page' : undefined}
        >
          BuzzFeed
        </a>
        <a
          href="/stores"
          onClick={() => setMenuOpen(false)}
          className={activePage === 'stores' ? 'active' : undefined}
          aria-current={activePage === 'stores' ? 'page' : undefined}
        >
          Stores
        </a>
        <a
          href="/categories"
          onClick={() => setMenuOpen(false)}
          className={activePage === 'categories' ? 'active' : undefined}
          aria-current={activePage === 'categories' ? 'page' : undefined}
        >
          Categories
        </a>
      </nav>

      {/* Search Bar */}
      <form
        className="nav-search"
        onSubmit={handleSearch}
      >
        <input
          type="search"
          id="searchInput"
          name="searchInput"
          placeholder="Search stores, products, or buzzes"
          aria-label="Search stores, products, or buzzes"
          value={isControlledSearch ? searchValue : undefined}
          onChange={isControlledSearch ? (event) => onSearchChange(event.target.value) : undefined}
        />
      </form>

      {/* Authentication */}
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-greeting">
              Hi, {user.name}!
            </span>

            <button
              type="button"
              className="login-button"
              onClick={() => {
                sessionStorage.removeItem('kumaritesToken');
                sessionStorage.removeItem('kumaritesUser');
                window.location.assign('/');
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="login-button"
            >
              Log In
            </a>

            <a
              href="/login?form=signup"
              onClick={() => setMenuOpen(false)}
              className="signup-button"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
      </div>
    </header>
  );
}
