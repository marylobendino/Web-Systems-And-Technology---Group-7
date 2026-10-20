import { useEffect, useMemo, useState } from 'react';
import '../kumarites.css';
import '../stores.css';
import { getStoreBuzzes, updateBuzzUsefulCount } from '../data/store-buzzes.js';

const tabs = [
  { id: 'latest', label: 'Latest Buzzes' },
  { id: 'sulit', label: 'Sulit Find' },
  { id: 'sale', label: 'Sale / Promo' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'advice', label: 'Advice' },
];

const popularCategories = [
  ['Food & Beverages', 12],
  ['Fashion', 10],
  ['Services', 6],
  ['Electronics', 5],
  ['Home & Living', 4],
  ['School Supplies', 3],
];

const categoryNames = {
  grocery: 'Grocery',
  food: 'Food & Beverages',
  fashion: 'Fashion',
  electronics: 'Electronics',
  'school-supplies': 'School Supplies',
  'home-living': 'Home & Living',
  services: 'Services',
};

export default function Stores() {
  const [buzzes, setBuzzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Latest');
  const [shareOpen, setShareOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    let isMounted = true;

    getStoreBuzzes()
      .then((loadedBuzzes) => {
        if (isMounted) {
          setBuzzes(loadedBuzzes);
        } else {
          loadedBuzzes.forEach((buzz) => {
            if (buzz.image.startsWith('blob:')) {
              URL.revokeObjectURL(buzz.image);
            }
          });
        }
      })
      .catch((error) => {
        console.error('Unable to load store Buzzes:', error);
        if (isMounted) {
          setLoadError('Unable to load Buzzes. Please refresh the page and try again.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBuzzes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const uniqueBuzzes = new Map();

    buzzes.forEach((buzz) => {
      const identity = [
        buzz.type,
        buzz.category,
        buzz.store,
        buzz.product,
        buzz.title,
      ]
        .map((value) => String(value || '').trim().toLowerCase())
        .join('|');

      if (!uniqueBuzzes.has(identity)) {
        uniqueBuzzes.set(identity, buzz);
      }
    });

    return [...uniqueBuzzes.values()]
      .filter((buzz) => activeTab === 'latest' || buzz.type?.toLowerCase() === activeTab)
      .filter((buzz) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          buzz.product,
          buzz.title,
          buzz.category,
          categoryNames[buzz.category],
          buzz.store,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return normalizedSearch.split(/\s+/).every((term) => searchableText.includes(term));
      })
      .sort((a, b) => {
        if (sortOrder === 'Oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortOrder === 'Most Popular') {
          return (b.usefulCount || 0) - (a.usefulCount || 0);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [activeTab, buzzes, searchTerm, sortOrder]);

  function handleUseful(buzz) {
    const storageKey = `kumaritesUseful_v2_${buzz.id}`;
    const wasUseful = localStorage.getItem(storageKey) === 'true';
    const nextUseful = !wasUseful;
    const nextCount = Math.max(0, Number(buzz.usefulCount || 0) + (nextUseful ? 1 : -1));

    if (nextUseful) {
      localStorage.setItem(storageKey, 'true');
    } else {
      localStorage.removeItem(storageKey);
    }

    setBuzzes((currentBuzzes) => currentBuzzes.map((item) => (
      item.id === buzz.id ? { ...item, usefulCount: nextCount } : item
    )));

    updateBuzzUsefulCount(buzz.id, nextCount).catch((error) => {
      console.error('Unable to update Useful count:', error);
      if (wasUseful) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
      setBuzzes((currentBuzzes) => currentBuzzes.map((item) => (
        item.id === buzz.id ? { ...item, usefulCount: buzz.usefulCount } : item
      )));
    });
  }

  function handleSave(buzzId) {
    const storageKey = `kumaritesSaved_${buzzId}`;
    if (localStorage.getItem(storageKey) === 'true') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, 'true');
    }
    setBuzzes((currentBuzzes) => [...currentBuzzes]);
  }

  function handleNavigationSearch(event) {
    setSearchTerm(event.target.value);
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('Link copied.');
    } catch {
      setCopyStatus('Unable to copy automatically. Copy the page URL from your browser.');
    }
  }

  function socialShareUrl(network) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Kumarites store page.');
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    return shareUrls[network];
  }

  return (
    <>
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
          <a href="/">Home</a>
          <a href="/HTML%20Pages/BuzzFeed.html">BuzzFeed</a>
          <a href="/stores" className="active" aria-current="page">Stores</a>
          <a href="/categories">Categories</a>
        </nav>

        <form className="nav-search" onSubmit={(event) => event.preventDefault()}>
          <input
            type="search"
            value={searchTerm}
            onChange={handleNavigationSearch}
            placeholder="Search stores, products, or buzzes"
            aria-label="Search stores, products, or buzzes"
          />
        </form>

        <div className="nav-actions">
          <a href="/login" className="login-button">Log In</a>
          <a href="/login?form=signup" className="signup-button">Sign Up</a>
        </div>
      </header>

      <main className="store-page">
        <section className="store-banner">
          <div className="store-banner-content">
            <p className="store-eyebrow">FEATURED STORE</p>
            <h1>SM Mall of Asia</h1>
            <p className="store-location">Pasay City, Metro Manila</p>
            <p>
              Shopping, dining, and more — discover the latest finds, promos,
              and experiences at SM Mall of Asia from the Kumarites community.
            </p>
            <div className="store-tags">
              <span>Mall</span>
              <span>Shopping</span>
              <span>Food</span>
              <span>Entertainment</span>
              <span>Services</span>
            </div>
          </div>
        </section>

        <section className="store-stats" aria-labelledby="store-stats-title">
          <div>
            <h2 id="store-stats-title">Store Stats</h2>
            <div className="stats-list">
              <p><strong>42</strong><span>Community Buzzes</span></p>
              <p><strong>1.2K</strong><span>Kumarites Visited</span></p>
              <p><strong>4.6</strong><span>Community Rating (120 ratings)</span></p>
            </div>
          </div>
          <div className="store-stats-actions">
            <button
              type="button"
              className="share-button"
              onClick={() => {
                setCopyStatus('');
                setShareOpen(true);
              }}
            >
              🔗 Share
            </button>
            <a className="create-buzz-button" href="/login">
              + Create a Buzz
            </a>
          </div>
        </section>

        <section className="store-tabs" aria-label="Browse store Buzzes">
          <div className="tabs-list" role="tablist" aria-label="Store Buzz categories">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="search-sort">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search buzzes in this store..."
              aria-label="Search buzzes in this store"
            />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort Buzzes"
            >
              <option>Latest</option>
              <option>Oldest</option>
              <option>Most Popular</option>
            </select>
          </div>
        </section>

        <div className="store-layout">
          <section className="buzz-list" aria-labelledby="buzz-list-title">
            <div className="buzz-list-header">
              <h2 id="buzz-list-title">Buzzes at SM Mall of Asia</h2>
              <span>{loading ? 'Loading Buzzes…' : `${filteredBuzzes.length} Buzzes`}</span>
            </div>
            {loading ? (
              <div className="store-empty-state" role="status">
                <p>Loading Buzzes…</p>
              </div>
            ) : loadError ? (
              <div className="store-empty-state" role="alert">
                <h3>Buzzes could not be loaded</h3>
                <p>{loadError}</p>
              </div>
            ) : filteredBuzzes.length > 0 ? (
              <div className="buzz-list-items">
                {filteredBuzzes.map((buzz) => (
                  <article className="store-buzz-card" key={buzz.id}>
                    <div className={`store-buzz-image${buzz.image ? '' : ' is-empty'}`}>
                      {buzz.image && <img src={buzz.image} alt={buzz.title} />}
                      <span>{buzz.type === 'sulit' ? 'Sulit Find' : buzz.type === 'sale' ? 'Sale / Promo' : buzz.type}</span>
                    </div>
                    <div className="store-buzz-content">
                      <span className="store-buzz-category">
                        {categoryNames[buzz.category] || buzz.category || 'Category'}
                      </span>
                      <h3>{buzz.title || 'Untitled Buzz'}</h3>
                      {buzz.product && <p className="store-buzz-product">{buzz.product}</p>}
                      <p className="store-buzz-store">{buzz.store || 'Community Find'}</p>
                      {buzz.price && (
                        <strong className="store-buzz-price">
                          {buzz.price.toString().includes('₱') ? buzz.price : `₱${buzz.price}`}
                        </strong>
                      )}
                      {buzz.description && <p className="store-buzz-description">{buzz.description}</p>}
                      {buzz.location && <p className="store-buzz-location">{buzz.location}</p>}
                      <p className="store-buzz-author">
                        Posted by <strong>{buzz.author || 'Kumarite'}</strong>
                        {buzz.createdAt && ` · ${new Date(buzz.createdAt).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`}
                      </p>
                      <div className="store-buzz-actions">
                        <button
                          type="button"
                          className={localStorage.getItem(`kumaritesUseful_v2_${buzz.id}`) === 'true' ? 'is-active' : ''}
                          aria-pressed={localStorage.getItem(`kumaritesUseful_v2_${buzz.id}`) === 'true'}
                          onClick={() => handleUseful(buzz)}
                        >
                          ♡ Useful <span>{buzz.usefulCount || 0}</span>
                        </button>
                        <button
                          type="button"
                          className={localStorage.getItem(`kumaritesSaved_${buzz.id}`) === 'true' ? 'is-saved' : ''}
                          aria-pressed={localStorage.getItem(`kumaritesSaved_${buzz.id}`) === 'true'}
                          onClick={() => handleSave(buzz.id)}
                        >
                          {localStorage.getItem(`kumaritesSaved_${buzz.id}`) === 'true' ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="store-empty-state">
                <span aria-hidden="true">🐝</span>
                <h3>No Buzzes found.</h3>
              </div>
            )}
          </section>

          <aside className="store-sidebar">
            <section className="about-store">
              <h2>About SM Mall of Asia</h2>
              <p>
                SM Mall of Asia is one of the largest malls in the Philippines,
                offering a wide range of shopping, dining, entertainment,
                and essential services.
              </p>
              <div className="store-details">
                <p><span aria-hidden="true">📍</span> Seaside Blvd, Mall of Asia Complex, Pasay City, Metro Manila</p>
                <p><span aria-hidden="true">🕒</span> 10:00 AM - 10:00 PM (Daily)</p>
                <p><span aria-hidden="true">☎</span> (02) 8556-0680</p>
                <p><span aria-hidden="true">🌐</span> <a href="https://www.smsupermalls.com" target="_blank" rel="noreferrer">www.smsupermalls.com</a></p>
              </div>
              <a
                className="official-website-button"
                href="https://www.smsupermalls.com"
                target="_blank"
                rel="noreferrer"
              >
                Visit Official Website
              </a>
            </section>

            <section className="store-map">
              <h2>📍 Store Location</h2>
              <div className="map-frame">
                <iframe
                  src="https://www.google.com/maps?q=SM+Mall+of+Asia&output=embed"
                  title="Map of SM Mall of Asia"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </section>

            <section className="popular-categories">
              <h2>Popular Categories in this Store</h2>
              <ol>
                {popularCategories.map(([category, count]) => (
                  <li key={category}>
                    {category}<strong>({count})</strong>
                  </li>
                ))}
              </ol>
            </section>

            <section className="cta-card">
              <h2>Share your finds!</h2>
              <p>Help other Kumarites discover great deals at SM Mall of Asia.</p>
              <a className="create-buzz-button" href="/login">Create a Buzz</a>
            </section>
          </aside>
        </div>
      </main>

      {shareOpen && (
        <div className="store-share-modal" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setShareOpen(false);
          }
        }}>
          <section
            className="store-share-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <button
              className="store-modal-close"
              type="button"
              onClick={() => setShareOpen(false)}
              aria-label="Close share dialog"
            >
              ×
            </button>
            <span className="store-share-icon" aria-hidden="true">🔗</span>
            <h2 id="share-modal-title">Share with Friends</h2>
            <p>Help your friends discover useful finds and deals.</p>
            <label htmlFor="share-link">Share your link</label>
            <div className="store-share-link">
              <input id="share-link" value={window.location.href} readOnly />
              <button type="button" onClick={copyShareLink}>Copy</button>
            </div>
            <p className="store-copy-status" role="status">{copyStatus}</p>
            <h3>Share to</h3>
            <div className="store-social-links">
              {['facebook', 'x', 'whatsapp', 'telegram', 'linkedin'].map((network) => (
                <a
                  key={network}
                  href={socialShareUrl(network)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {network === 'x' ? 'X' : network[0].toUpperCase() + network.slice(1)}
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
