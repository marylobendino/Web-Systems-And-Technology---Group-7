import { useState } from 'react';
import { updateBuzzUsefulCount, updateBuzzSaved } from '../data/buzzes.js';

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
    () => typeof buzz.isUsefulByMe === 'boolean' ? buzz.isUsefulByMe : readPreference(usefulStorageKey)
  );

  const [isSaved, setIsSaved] = useState(
    () => typeof buzz.isSavedByMe === 'boolean' ? buzz.isSavedByMe : readPreference(savedStorageKey)
  );
  const [actionError, setActionError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [actionUsefulCount, setActionUsefulCount] = useState(Number(buzz.usefulCount || 0));

  const usefulCount = actionUsefulCount;

  // Toggle Useful
  async function handleUseful() {
    const nextValue = !isUseful;
    setActionError('');
    try {
      const updated = await updateBuzzUsefulCount(buzz.id, nextValue ? 1 : -1);
      setIsUseful(nextValue);
      savePreference(usefulStorageKey, nextValue);
      if (updated) setActionUsefulCount(Number(updated.usefulCount || 0));
    } catch (error) {
      setActionError(error.message || 'Unable to update Useful. Please sign in and try again.');
    }
  }

  // Save state is stored on the account, not just in this browser.
  async function handleSave() {
    const nextValue = !isSaved;
    setActionError('');
    try {
      await updateBuzzSaved(buzz.id, nextValue);
      setIsSaved(nextValue);
      savePreference(savedStorageKey, nextValue);
    } catch (error) {
      setActionError(error.message || 'Unable to save this Buzz. Please sign in and try again.');
    }
  }

  // Buzz image
  const rawImage = buzz.imageData || buzz.image || '';
  const imageSrc = rawImage
    ? (/^(https?:|data:|blob:)/i.test(rawImage) || rawImage.startsWith('/')
        ? rawImage
        : `/${rawImage.split('/').map(encodeURIComponent).join('/')}`)
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
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={buzz.product || buzz.title || 'Community find'}
            loading="lazy"
            onError={() => setImageFailed(true)}
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
        {actionError && <p role="alert">{actionError}</p>}
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
