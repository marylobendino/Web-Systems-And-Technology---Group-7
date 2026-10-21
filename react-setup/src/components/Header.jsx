
export default function Header() {
  function handleSearch(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('searchInput') || '').trim();

    if (query) {
      alert(
        `Search functionality will be connected next. Search: ${query}`
      );
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

      {/* Main Navigation */}
      <nav
        className="main-navigation"
        aria-label="Main navigation"
      >
        <a href="/">Home</a>

        <a href="/HTML%20Pages/BuzzFeed.html">
          BuzzFeed
        </a>

        <a href="/HTML%20Pages/stores.html">
          Stores
        </a>

        <a
          href="/categories"
          className="active"
          aria-current="page"
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
        />
      </form>

      {/* Authentication */}
      <div className="nav-actions">
        <a
          href="/login"
          className="login-button"
        >
          Log In
        </a>

        <a
          href="/login?form=signup"
          className="signup-button"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
}
