
import '../kumarites.css';

const categories = [
  { id: 'grocery', icon: '🛒', label: 'Grocery' },
  { id: 'food', icon: '🍽️', label: 'Food & Beverages' },
  { id: 'fashion', icon: '👗', label: 'Fashion' },
  { id: 'electronics', icon: '📱', label: 'Electronics' },
  { id: 'school-supplies', icon: '📒', label: 'School Supplies' },
  { id: 'home-living', icon: '🏠', label: 'Home & Living' },
  { id: 'services', icon: '⚙️', label: 'Services' },
  { id: 'all', icon: '🔍︎', label: 'View All' },
];

const stores = [
  { name: 'SM Mall of Asia', buzzes: 42, initials: 'SM' },
  { name: 'SM Fairview', buzzes: 38, initials: 'SM' },
  { name: 'Uptown Mall', buzzes: 35, initials: 'UM' },
  { name: 'Glorietta', buzzes: 34, initials: 'G' },
  { name: 'Unitop Cebu', buzzes: 30, initials: 'UC' },
  { name: 'SM Pampanga', buzzes: 28, initials: 'SM' },
  { name: 'SM Tuguegarao', buzzes: 26, initials: 'SM' },
  { name: 'Fairview Terraces', buzzes: 24, initials: 'FT' },
  { name: 'TriNoma', buzzes: 21, initials: 'T' },
  { name: 'SM Bacoor', buzzes: 19, initials: 'SM' },
];

const menuLinks = [
  { label: 'Home', href: '/' },
  { label: 'Buzz Feed', href: '/HTML%20Pages/BuzzFeed.html' },
  { label: 'Stores', href: '/stores' },
  { label: 'Categories', href: '/HTML%20Pages/categories.html' },
  { label: 'About Kumarites', href: '/HTML%20Pages/about.html' },
];

export default function Home() {
  function handleSearch(event) {
    event.preventDefault();
    const query = event.currentTarget.elements.searchInput.value.trim();

    if (query) {
      alert(`Search functionality will be connected next. Search: ${query}`);
    }
  }

  function handleCategory(category) {
    alert(`Category selected: ${category}. Filtering will be connected next.`);
  }

  return (
    <>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">
          <a href="/">
            <img
              src="/Images/BuzzFeed%20Images/Kumarites%20Logo.png"
              alt="Kumarites"
            />
          </a>
          <p>Real Finds. Real People. A More Sulit You.</p>
        </div>

        <nav className="main-navigation" aria-label="Main navigation">
          <a href="/" className="active">Home</a>
          <a href="/HTML%20Pages/BuzzFeed.html">BuzzFeed</a>
          <a href="/stores">Stores</a>
          <a href="/HTML%20Pages/categories.html">Categories</a>
        </nav>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="search"
            id="searchInput"
            name="searchInput"
            placeholder="Search stores, products, or buzzes"
            aria-label="Search stores, products, or buzzes"
          />
        </form>

        <div className="nav-actions">
          <a href="/login" className="login-button">Log In</a>
          <a href="/login?form=signup" className="signup-button">Sign Up</a>
        </div>
      </header>

      <main>
        {/* Banner Section */}
        <section className="page-bee">
          <div className="bee-content">
            <div className="bee-image">
              <img
                src="/Images/Kumarites%20Banner%20V2.png"
                alt="Kumarites community sharing finds"
              />
            </div>

            <div className="bee-text">
              <h2>
                Good Finds Start with <br />
                <span><em>Good Tsika</em></span>
              </h2>

              <p>
                Kumarites is a community-driven platform where people share
                sulit finds, price updates, and store recommendations because
                every little savings goes a long way.
              </p>

              <div className="banner-buttons">
                <a
                  href="/HTML%20Pages/BuzzFeed.html"
                  className="primary-button"
                >
                  Explore Buzzes →
                </a>
                <a
                  href="/stores"
                  className="secondary-button"
                >
                  Browse Stores →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category */}
        <section className="categories">
          <div className="categories-header">
            <h2>Browse by Category</h2>
          </div>

          <div className="categories-content">
            {categories.map((category) => (
              <button
                type="button"
                className="category-card"
                data-category={category.id}
                key={category.id}
                onClick={() => handleCategory(category.label)}
              >
                <span className="category-icon" aria-hidden="true">
                  {category.icon}
                </span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Latest Buzzes and Trending Stores */}
        <div className="buzzes-stores-container">
          <section className="latest-buzzes">
            <div className="latest-buzzes-header">
              <h2>Latest Buzzes</h2>
              <a href="/HTML%20Pages/BuzzFeed.html">
                View all buzzes →
              </a>
            </div>

            <div className="latest-buzzes-list" id="buzzContainer">
              <p>
                Latest buzzes will appear here when the existing
                buzz data is connected.
              </p>
            </div>
          </section>

          <section className="trending-stores">
            <div className="trending-stores-header">
              <h2>Trending Stores</h2>
              <a href="/stores">
                View all stores →
              </a>
            </div>

            <div className="trending-stores-list">
              {stores.map((store, index) => (
                <div className="store-item" key={store.name}>
                  <strong>{index + 1}</strong>

                  <div className="store-logo">
                    {store.initials}
                  </div>

                  <div>
                    <h3>{store.name}</h3>
                    <p>{store.buzzes} buzzes</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column footer-brand">
            <a href="/">
              <img
                src="/Images/BuzzFeed%20Images/Kumarites%20Logo.png"
                alt="Kumarites"
                width="200"
              />
            </a>

            <p>Real Finds. Real People. A More Sulit You.</p>

            <p>
              A community-driven platform where people share
              sulit finds, price updates, and store recommendations.
            </p>
          </div>

          <div className="footer-column">
            <h3>Menu</h3>
            {menuLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <a href="#">Contact Us</a>
            <a href="#">Community Guidelines</a>
            <a href="#">Privacy Policy</a>
          </div>

          <div className="footer-column footer-social">
            <h3>Follow Us</h3>

            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <img
                  src="/Images/footer%20-%20facebook%20icon.png"
                  alt="Facebook"
                />
              </a>

              <a href="#" aria-label="Instagram">
                <img
                  src="/Images/footer%20-%20instagram%20icon.png"
                  alt="Instagram"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Kumarites. Community-powered consumer information.
          </p>
        </div>
      </footer>
    </>
  );
}
