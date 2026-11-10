import { useEffect, useState } from 'react';
import {
  getCommunityBuzzes,
  updateBuzzUsefulCount,
  updateBuzzSaved,
} from '../data/buzzes.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const CATEGORY_ICONS = {
  grocery: '🛒',
  food: '🍽️',
  fashion: '👗',
  electronics: '📱',
  'school-supplies': '📒',
  'home-living': '🏠',
  services: '⚙️',
  all: '🔍',
};

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

// Normalize category values before comparing them.
function normalizeCategory(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Search all relevant Buzz fields except description.
// Uses whole-word matching to prevent partial-word matches.
function buzzMatchesSearch(buzz, search) {
  if (!search.trim()) return true;

  const searchableFields = [
    buzz.title,
    buzz.product,
    buzz.store,
    buzz.location,
    buzz.category,
    categoryNames[buzz.category],
    buzz.author,
    buzz.price,
    buzz.type,
  ];

  const normalizedSearch = search.trim().toLowerCase();

  const escapedSearch = normalizedSearch.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const wordPattern = new RegExp(
    `(^|[^a-z0-9])${escapedSearch}($|[^a-z0-9])`,
    'i'
  );

  return searchableFields.some((field) => {
    if (field === null || field === undefined) return false;

    return wordPattern.test(String(field).toLowerCase());
  });
}

function HomeBuzzCard({ buzz, onUseful }) {
  const usefulKey = `kumaritesUseful_v2_${buzz.id}`;
  const savedKey = `kumaritesSaved_${buzz.id}`;

  const [isUseful, setIsUseful] = useState(
    () =>
      typeof buzz.isUsefulByMe === 'boolean'
        ? buzz.isUsefulByMe
        : readPreference(usefulKey)
  );

  const [isSaved, setIsSaved] = useState(
    () =>
      typeof buzz.isSavedByMe === 'boolean'
        ? buzz.isSavedByMe
        : readPreference(savedKey)
  );

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
        console.error('Unable to save Useful action:', error);
        setIsUseful(!nextValue);
        setActionError('Unable to save this action. Please try again.');
      });
    } catch (error) {
      console.error('Unable to update Useful state:', error);
      setIsUseful(!nextValue);
      setActionError('Unable to save this action. Please try again.');
    }
  }

  async function handleSave() {
    const nextValue = !isSaved;
    setActionError('');

    try {
      await updateBuzzSaved(buzz.id, nextValue);

      if (nextValue) {
        localStorage.setItem(savedKey, 'true');
      } else {
        localStorage.removeItem(savedKey);
      }

      setIsSaved(nextValue);
    } catch (error) {
      setActionError(
        error.message ||
          'Unable to save this Buzz. Please sign in and try again.'
      );
    }
  }

  const imageSrc = buzz.image || '';

  return (
    <article className="buzz-card">
      <div
        className={`buzz-image${imageSrc ? '' : ' buzz-image-placeholder'}`}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={buzz.product || buzz.title}
            loading="lazy"
          />
        )}
      </div>

      <div className="buzz-card-content">
        <span className="buzz-category">
          {categoryNames[buzz.category] || buzz.category || 'Category'}
        </span>

        <h3>{buzz.title || 'Untitled Buzz'}</h3>

        {buzz.product && (
          <p className="buzz-product">{buzz.product}</p>
        )}

        <p className="buzz-store">
          <strong>{buzz.store || 'Community Find'}</strong>
          {buzz.location && <span>{buzz.location}</span>}
        </p>

        {(buzz.price || buzz.category) && (
          <div className="buzz-details">
            <span>
              {categoryNames[buzz.category] || buzz.category}
            </span>

            {buzz.price && (
              <strong className="price">
                {String(buzz.price).includes('₱')
                  ? buzz.price
                  : `₱${buzz.price}`}
              </strong>
            )}
          </div>
        )}

        {buzz.description && (
          <p className="buzz-description">{buzz.description}</p>
        )}

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
            {isUseful ? '♥' : '♡'} Useful{' '}
            <span>{Number(buzz.usefulCount || 0)}</span>
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

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  const [homeSearch, setHomeSearch] = useState('');
  const [selectedHomeCategory, setSelectedHomeCategory] =
    useState('all');

  // Fetch categories from the backend.
  useEffect(() => {
    let isMounted = true;

    fetch('/api/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load categories.');
        }

        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          const apiCategories = data.categories.map((category) => ({
            ...category,
            label: category.name,
            icon: CATEGORY_ICONS[category.id] || '🔍',
          }));

          setCategories([
            ...apiCategories,
            {
              id: 'all',
              label: 'View All',
              icon: CATEGORY_ICONS.all,
            },
          ]);
        }
      })
      .catch((error) => {
        console.error('Unable to load categories:', error);

        if (isMounted) {
          setCategoriesError(
            'Unable to load categories. Please try again.'
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch shared Buzz data from the backend.
  useEffect(() => {
    let isMounted = true;

    async function loadBuzzes() {
      try {
        const loaded = await getCommunityBuzzes();

        if (isMounted) {
          setBuzzes(loaded);
          setBuzzesError('');
        }
      } catch (error) {
        console.error('Unable to load Home Buzzes:', error);

        if (isMounted) {
          setBuzzesError('Unable to load Buzzes. Please try again.');
        }
      } finally {
        if (isMounted) {
          setBuzzesLoading(false);
        }
      }
    }

    loadBuzzes();

    const intervalId = window.setInterval(loadBuzzes, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // Handle Useful action.
  function handleUseful(buzz, usefulCount, wasUseful) {
    setBuzzes((currentBuzzes) =>
      currentBuzzes.map((item) =>
        item.id === buzz.id ? { ...item, usefulCount } : item
      )
    );

    return updateBuzzUsefulCount(
      buzz.id,
      wasUseful ? -1 : 1
    )
      .then((updatedBuzz) => {
        setBuzzes((currentBuzzes) =>
          currentBuzzes.map((item) =>
            item.id === buzz.id
              ? {
                  ...item,
                  usefulCount: updatedBuzz.usefulCount,
                  isUsefulByMe: updatedBuzz.isUsefulByMe,
                }
              : item
          )
        );
      })
      .catch((error) => {
        console.error('Unable to update Useful count:', error);

        const previousCount = Number(buzz.usefulCount || 0);
        const storageKey = `kumaritesUseful_v2_${buzz.id}`;

        try {
          if (wasUseful) {
            localStorage.setItem(storageKey, 'true');
          } else {
            localStorage.removeItem(storageKey);
          }
        } catch (storageError) {
          console.error('Unable to restore Useful state:', storageError);
        }

        setBuzzes((currentBuzzes) =>
          currentBuzzes.map((item) =>
            item.id === buzz.id
              ? { ...item, usefulCount: previousCount }
              : item
          )
        );

        throw error;
      });
  }

  // Handle category selection.
  function handleCategory(categoryId) {
    setSelectedHomeCategory(categoryId);

    document.getElementById('buzzContainer')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // Apply search and category filtering together.
  const normalizedHomeSearch = homeSearch.trim();

  const visibleHomeBuzzes = buzzes.filter((buzz) => {
    const buzzCategory = normalizeCategory(buzz.category);

    const matchesCategory =
      selectedHomeCategory === 'all' ||
      buzzCategory === normalizeCategory(selectedHomeCategory);

    const matchesSearch = buzzMatchesSearch(
      buzz,
      normalizedHomeSearch
    );

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header
        activePage="home"
        searchValue={homeSearch}
        onSearchChange={setHomeSearch}
      />

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
                <span>
                  <em>Good Tsika</em>
                </span>
              </h2>

              <p>
                Kumarites is a community-driven platform where people
                share sulit finds, price updates, and store
                recommendations because every little savings goes a
                long way.
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
            {categoriesLoading ? (
              <p role="status">Loading categories...</p>
            ) : categoriesError ? (
              <p role="alert">{categoriesError}</p>
            ) : (
              categories.map((category) => (
                <button
                  type="button"
                  className={`category-card${
                    selectedHomeCategory === category.id
                      ? ' active'
                      : ''
                  }`}
                  data-category={category.id}
                  aria-pressed={selectedHomeCategory === category.id}
                  key={category.id}
                  onClick={() => handleCategory(category.id)}
                >
                  <span className="category-icon" aria-hidden="true">
                    {category.icon}
                  </span>

                  <span>{category.label}</span>
                </button>
              ))
            )}
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
                <p role="status">Loading latest Buzzes...</p>
              ) : buzzesError ? (
                <p role="alert">{buzzesError}</p>
              ) : visibleHomeBuzzes.length > 0 ? (
                visibleHomeBuzzes.map((buzz) => (
                  <HomeBuzzCard
                    key={buzz.id}
                    buzz={buzz}
                    onUseful={handleUseful}
                  />
                ))
              ) : (
                <p className="no-buzz-results">
                  No Buzzes match your search or selected category.
                </p>
              )}
            </div>
          </section>

          {/* Trending Stores */}
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