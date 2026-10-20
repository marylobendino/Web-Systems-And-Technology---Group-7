
import { useState } from 'react';

// Read saved preferences from this browser.
function readPreference(key) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

// Store preferences for future page visits.
function savePreference(key, value) {
  try {
    if (value) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // The buttons can still work during this visit
    // if browser storage is unavailable.
  }
}

export default function CategoryBuzzCard({ buzz }) {

  // Give every predefined Buzz a consistent local identifier.
  const buzzKey =
    `${buzz.category}:${buzz.title}:${buzz.createdAt}`;

  const usefulStorageKey = `categoryUseful:${buzzKey}`;
  const savedStorageKey = `categorySaved:${buzzKey}`;

  // Useful and Save state
  const [isUseful, setIsUseful] = useState(
    () => readPreference(usefulStorageKey)
  );

  const [isSaved, setIsSaved] = useState(
    () => readPreference(savedStorageKey)
  );

  const usefulCount =
    Number(buzz.usefulCount || 0) + (isUseful ? 1 : 0);

  // Toggle Useful
  function handleUseful() {
    const nextValue = !isUseful;

    setIsUseful(nextValue);
    savePreference(usefulStorageKey, nextValue);
  }

  // Toggle Save
  function handleSave() {
    const nextValue = !isSaved;

    setIsSaved(nextValue);
    savePreference(savedStorageKey, nextValue);
  }

  // Buzz image
  const imageSrc = buzz.image
    ? '/' + buzz.image.split('/').map(encodeURIComponent).join('/')
    : null;

  // Format the posting date
  const postedDate = buzz.createdAt
    ? new Date(buzz.createdAt).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="category-buzz-card">

      {/* Buzz Image */}
      <div className="category-buzz-image">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={buzz.product || buzz.title}
            loading="lazy"
          />
        ) : (
          <div className="category-buzz-no-image">
            No image available
          </div>
        )}
      </div>

      {/* Buzz Content */}
      <div className="category-buzz-content">

        <span className="category-buzz-type">
          {buzz.type}
        </span>

        <h3>{buzz.title}</h3>

        {buzz.product && (
          <p className="category-buzz-product">
            {buzz.product}
          </p>
        )}

        {buzz.store && (
          <p className="category-buzz-store">
            {buzz.store}
          </p>
        )}

        {buzz.price && (
          <p className="category-buzz-price">
            {buzz.price}
          </p>
        )}

        <p className="category-buzz-description">
          {buzz.description}
        </p>

        {buzz.location && (
          <p className="category-buzz-location">
            📍 {buzz.location}
          </p>
        )}

        {/* Author and Date */}
        <div className="category-buzz-meta">
          <span>
            Posted by {buzz.author || 'Kumarite'}
          </span>

          {postedDate && (
            <span> · {postedDate}</span>
          )}
        </div>

        {/* Useful and Save */}
        <div className="category-buzz-actions">

          <button
            type="button"
            className={`category-useful-button ${isUseful ? 'active' : ''}`}
            aria-pressed={isUseful}
            onClick={handleUseful}
          >
            {isUseful ? '♥' : '♡'} Useful {usefulCount}
          </button>

          <button
            type="button"
            className={`category-save-button ${isSaved ? 'saved' : ''}`}
            aria-pressed={isSaved}
            onClick={handleSave}
          >
            {isSaved ? 'Saved ✓' : 'Save'}
          </button>

        </div>

      </div>

    </article>
  );
}
