const menuLinks = [
  { label: 'Home', href: '/' },
  { label: 'Buzz Feed', href: '/buzzfeed' },
  { label: 'Stores', href: '/stores' },
  { label: 'Categories', href: '/categories' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column footer-brand">
          <a href="/" aria-label="KuMarites home">
            <img src="/Images/BuzzFeed%20Images/Kumarites%20Logo.png" alt="KuMarites" width="200" />
          </a>
          <p>Real Finds. Real People. A More Sulit You.</p>
          <p>A community-driven platform where people share sulit finds, price updates, and store recommendations.</p>
        </div>
        <div className="footer-column">
          <h3>Menu</h3>
          {menuLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <a href="mailto:hello@kumarites.com">Contact Us</a>
          <a href="/community-guidelines">Community Guidelines</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
        <div className="footer-column footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer">
              <img src="/Images/footer%20-%20facebook%20icon.png" alt="" />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
              <img src="/Images/footer%20-%20instagram%20icon.png" alt="" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KuMarites. Community-powered consumer information.</p>
      </div>
    </footer>
  );
}
