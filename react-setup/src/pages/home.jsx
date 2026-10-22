import { useEffect, useState } from 'react';
import { getStoreBuzzes, updateBuzzUsefulCount } from '../data/store-buzzes.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
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
  { label: 'Stores', href: '/HTML%20Pages/stores.html' },
  { label: 'Categories', href: '/HTML%20Pages/categories.html' },
  { label: 'About Kumarites', href: '/HTML%20Pages/about.html' },
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

function readPreference(key) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function removeDuplicateBuzzes(buzzes) {
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

  return [...uniqueBuzzes.values()];
}

function HomeBuzzCard({ buzz, onUseful }) {
  const usefulKey = `kumaritesUseful_v2_${buzz.id}`;
  const savedKey = `kumaritesSaved_${buzz.id}`;
  const [isUseful, setIsUseful] = useState(() => readPreference(usefulKey));
  const [isSaved, setIsSaved] = useState(() => readPreference(savedKey));
  const [actionError, setActionError] = useState('');
  const postedDate = buzz.createdAt
    ? new Date(buzz.createdAt).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  function handleUseful() {
    const nextValue = !isUseful;
    const nextCount = Math.max(
      0,
      Number(buzz.usefulCount || 0) + (nextValue ? 1 : -1)
    );

    setActionError('');
    setIsUseful(nextValue);
    try {
      if (nextValue) {
        localStorage.setItem(usefulKey, 'true');
      } else {
        localStorage.removeItem(usefulKey);
      }
      onUseful(buzz, nextCount, isUseful).catch((error) => {
        console.error('Unable to save the Buzz Useful action:', error);
        setIsUseful(!nextValue);
        setActionError('Unable to save this action. Please try again.');
      });
    } catch (error) {
      console.error('Unable to update the Buzz Useful state:', error);
      setIsUseful(!nextValue);
      setActionError('Unable to save this action. Please try again.');
    }
  }

  function handleSave() {
    const nextValue = !isSaved;
    setActionError('');

    try {
      if (nextValue) {
        localStorage.setItem(savedKey, 'true');
      } else {
        localStorage.removeItem(savedKey);
      }
      setIsSaved(nextValue);
    } catch (error) {
      console.error('Unable to update the Buzz saved state:', error);
      setActionError('Unable to save this action. Please try again.');
    }
  }

  const imageSrc = buzz.image || '';

  return (
    <article className="buzz-card">
      <div className={`buzz-image${imageSrc ? '' : ' buzz-image-placeholder'}`}>
        {imageSrc && <img src={imageSrc} alt={buzz.product || buzz.title} loading="lazy" />}
      </div>

      <div className="buzz-card-content">
        <span className="buzz-category">
          {categoryNames[buzz.category] || buzz.category || 'Category'}
        </span>
        <h3>{buzz.title || 'Untitled Buzz'}</h3>
        {buzz.product && <p className="buzz-product">{buzz.product}</p>}
        <p className="buzz-store">
          <strong>{buzz.store || 'Community Find'}</strong>
          {buzz.location && <span>{buzz.location}</span>}
        </p>
        {(buzz.price || buzz.category) && (
          <div className="buzz-details">
            <span>{categoryNames[buzz.category] || buzz.category}</span>
            {buzz.price && (
              <strong className="price">
                {buzz.price.toString().includes('₱') ? buzz.price : `₱${buzz.price}`}
              </strong>
            )}
          </div>
        )}
        {buzz.description && <p className="buzz-description">{buzz.description}</p>}
        <p className="buzz-author">
          Posted by <strong>{buzz.author || 'Kumarite'}</strong>
          {postedDate && ` · ${postedDate}`}
        </p>
        <div className="buzz-actions">
          <button
            type="button"
            className={`useful-button${isUseful ? ' liked' : ''}`}
            aria-pressed={isUseful}
            onClick={handleUseful}
          >
            {isUseful ? '♥' : '♡'} Useful <span>{Number(buzz.usefulCount || 0)}</span>
          </button>
          <button
            type="button"
            className={`save-button${isSaved ? ' saved' : ''}`}
            aria-pressed={isSaved}
            onClick={handleSave}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
        {actionError && <p role="alert">{actionError}</p>}
      </div>
    </article>
  );
}

export default function Home() {
  const [buzzes, setBuzzes] = useState([]);
  const [buzzesLoading, setBuzzesLoading] = useState(true);
  const [buzzesError, setBuzzesError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let loadedBuzzes = [];

    getStoreBuzzes()
      .then((loaded) => {
        loadedBuzzes = loaded;
        if (isMounted) {
          setBuzzes(removeDuplicateBuzzes(loaded));
        } else {
          loaded.forEach((buzz) => {
            if (buzz.image?.startsWith('blob:')) {
              URL.revokeObjectURL(buzz.image);
            }
          });
        }
      })
      .catch((error) => {
        console.error('Unable to load Home Buzzes:', error);
        if (isMounted) {
          setBuzzesError('Unable to load Buzzes. Please refresh the page and try again.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setBuzzesLoading(false);
        }
      });

    return () => {
      isMounted = false;
      loadedBuzzes.forEach((buzz) => {
        if (buzz.image?.startsWith('blob:')) {
          URL.revokeObjectURL(buzz.image);
        }
      });
    };
  }, []);

  function handleUseful(buzz, usefulCount, wasUseful) {
    setBuzzes((currentBuzzes) => currentBuzzes.map((item) => (
      item.id === buzz.id ? { ...item, usefulCount } : item
    )));

    return updateBuzzUsefulCount(buzz.id, usefulCount).catch((error) => {
      console.error('Unable to update the Buzz Useful count:', error);
      const previousCount = Number(buzz.usefulCount || 0);
      const storageKey = `kumaritesUseful_v2_${buzz.id}`;

      try {
        if (wasUseful) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (storageError) {
        console.error('Unable to restore the Buzz Useful state:', storageError);
      }

      setBuzzes((currentBuzzes) => currentBuzzes.map((item) => (
        item.id === buzz.id ? { ...item, usefulCount: previousCount } : item
      )));
      throw error;
    });
  }

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
      <Header activePage="home" />

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
                  href="/HTML%20Pages/stores.html"
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
              {buzzesLoading ? (
                <p role="status">Loading latest Buzzes…</p>
              ) : buzzesError ? (
                <p role="alert">{buzzesError}</p>
              ) : buzzes.length > 0 ? (
                buzzes.map((buzz) => (
                  <HomeBuzzCard
                    key={buzz.id}
                    buzz={buzz}
                    onUseful={handleUseful}
                  />
                ))
              ) : (
                <p className="no-buzz-results">No Buzzes found.</p>
              )}
            </div>
          </section>

          <section className="trending-stores">
            <div className="trending-stores-header">
              <h2>Trending Stores</h2>
              <a href="/HTML%20Pages/stores.html">
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

      <Footer />
    </>
  );
}
