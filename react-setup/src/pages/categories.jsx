
import { useState } from 'react';
import '../kumarites.css';
import '../categories.css';
import { defaultBuzzes } from '../data/defaultBuzzes.js';
import CategoryBuzzCard from '../components/CategoryBuzzCard.jsx';
import Header from '../components/Header.jsx';

// Category information
const categories = [
  {
    id: 'grocery',
    name: 'Grocery',
    icon: '🛒',
    keywords: 'supermarket rice snacks essentials',
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: '🍽️',
    keywords: 'meals drinks restaurants promos',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    keywords: 'clothing shoes accessories',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    keywords: 'gadgets phones technology',
  },
  {
    id: 'school-supplies',
    name: 'School Supplies',
    icon: '📒',
    keywords: 'notebooks pens stationery',
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    icon: '🏠',
    keywords: 'household appliances essentials',
  },
  {
    id: 'services',
    name: 'Services',
    icon: '⚙️',
    keywords: 'repair local assistance',
  },
];

// Featured category information
const featuredCategories = [
  {
    id: 'grocery',
    name: 'Grocery',
    icon: '🛒',
    label: 'EVERYDAY FINDS',
    description:
      'Check everyday essentials, supermarket deals, and budget-friendly grocery finds.',
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: '🍽️',
    label: 'SULIT EATS',
    description:
      'Discover affordable meals, food promos, and recommendations shared by the community.',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    label: 'SMART FINDS',
    description:
      'Explore gadget deals, useful accessories, and electronics recommendations.',
  },
];

export default function Categories() {

  // React state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ctaMessage, setCtaMessage] = useState('');

  // Search and filter categories
  const searchTerms = search
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const filteredCategories = categories.filter((category) => {
    const searchableText =
      `${category.name} ${category.keywords}`.toLowerCase();

    return searchTerms.every((term) =>
      searchableText.includes(term)
    );
  });

  // Handle Featured category buttons
  function handleFeaturedCategory(categoryId) {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) {
      return;
    }

    setSearch(category.name);
    setSelectedCategory(category);

    document.getElementById('exploreCategories')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
const selectedBuzzes = selectedCategory
  ? defaultBuzzes.filter(
      (buzz) => buzz.category === selectedCategory.id
    )
  : [];
  // Handle Create a Buzz button
  function handleCreateBuzz() {
    setCtaMessage(
      'Create a Buzz will be connected in a future integration step.'
    );
  }

  return (
  <>
    <Header />

    <main className="categories-page">

      {/* =====================================
          HERO BANNER
          ===================================== */}

      <section className="page-bee categories-page-bee">
        <div className="bee-content">

          <div className="bee-image">
            <img
              src="/Images/Categories%20Images/categories%20banner.png"
              alt="Shopping mall"
            />
          </div>

          <div className="bee-text">
            <h1>
              Find What's <span>Sulit</span> for <em>You</em>
            </h1>

            <p>
              Browse categories to discover sulit finds, deals,
              recommendations, and helpful tips shared by the
              Kumarites community.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================
          EXPLORE CATEGORIES
          ===================================== */}

      <section
        className="categories-section"
        id="exploreCategories"
      >

        <div className="categories-heading">
          <h2>Explore Categories</h2>

          <p>
            Find the kind of sulit discovery you're looking for
          </p>
        </div>

        {/* Category Search */}
        <div className="category-search">
          <input
            type="search"
            placeholder="Search categories..."
            aria-label="Search categories"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {/* Category Cards */}
        <div className="category-list">

          {filteredCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              className="category-card"
              onClick={() =>
                setSelectedCategory(category)
              }
              aria-pressed={selectedCategory?.id === category.id}
            >

              <span
                className="category-icon"
                aria-hidden="true"
              >
                {category.icon}
              </span>

              <span className="category-name">
                {category.name}
              </span>

            </button>
          ))}

        </div>

        {/* No Search Results */}
        {filteredCategories.length === 0 && (
          <p className="no-category-result">
            No matching category found.
          </p>
        )}

        {/* Selected Category Results */}

{selectedCategory && (
  <section className="category-results">

    <div className="category-results-header">
      <div>
        <p className="category-results-label">
          CATEGORY FINDS
        </p>

        <h3>{selectedCategory.name}</h3>

        <p>
          Discover sulit finds, deals, and recommendations
          shared by the Kumarites community.
        </p>
      </div>


<button
  type="button"
  className="category-results-close"
  onClick={() => setSelectedCategory(null)}
  aria-label="Close category results"
  title="Close category results"
>
  ×
</button>

    </div>

    {selectedBuzzes.length > 0 ? (
      <div className="category-buzz-list">
        {selectedBuzzes.map((buzz) => (
          <CategoryBuzzCard
            key={`${buzz.title}-${buzz.createdAt}`}
            buzz={buzz}
          />
        ))}
      </div>
    ) : (
      <p className="no-buzz-results">
        No Buzzes found in this category.
      </p>
    )}

  </section>
)}
</section>

      {/* =====================================
          FEATURED THIS WEEK
          ===================================== */}

      <section className="featured-categories">

        <div className="section-heading">

          <p className="section-label">
            DISCOVER
          </p>

          <h2>
            Featured This Week
          </h2>

          <p className="section-description">
            Discover categories featuring everyday finds,
            sulit deals, and useful community recommendations.
          </p>

        </div>

        {/* Featured Cards */}
        <div className="featured-list">

          {featuredCategories.map((featured) => (
            <article
              className="featured-card"
              key={featured.id}
            >

              <div
                className="featured-icon"
                aria-hidden="true"
              >
                {featured.icon}
              </div>

              <div className="featured-details">

                <span className="featured-tag">
                  {featured.label}
                </span>

                <h3>
                  {featured.name}
                </h3>

                <p>
                  {featured.description}
                </p>

                <button
                  type="button"
                  className="featured-link"
                  onClick={() =>
                    handleFeaturedCategory(featured.id)
                  }
                >
                  Explore {featured.name} →
                </button>

              </div>

            </article>
          ))}

        </div>

      </section>

      {/* =====================================
          COMMUNITY CALL TO ACTION
          ===================================== */}

      <section className="categories-cta">

        <div className="categories-cta-content">

          <div className="cta-text">

            <p className="cta-label">
              KUMARITES COMMUNITY
            </p>

            <h2>
              Got a sulit find?
            </h2>

            <p>
              Share your discovery with the community.
              Your tsika might help another Kumarite save.
            </p>

          </div>

          <div className="categories-cta-actions">

            <button
              type="button"
              className="cta-button"
              onClick={handleCreateBuzz}
            >
              + Create a Buzz
            </button>

            {ctaMessage && (
              <p
                className="categories-cta-note"
                role="status"
              >
                {ctaMessage}
              </p>
            )}

          </div>

        </div>

      </section>

        </main>
  </>
  );
}