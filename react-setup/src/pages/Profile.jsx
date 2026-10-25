
import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { getCommunityBuzzes } from '../data/buzzes.js';

function getBuzzImage(buzz) {
  const image =
    buzz.imageData || buzz.image || buzz.imageUrl || '';

  if (!image) return '';

  if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
    return image;
  }

  return `/${image.replace(/^\/+/, '')}`;
}

function ProfileBuzzCard({ buzz }) {
  const [imageFailed, setImageFailed] = useState(false);

  const image = getBuzzImage(buzz);
  const type = String(buzz.type || 'find').toLowerCase();

  const createdAt = buzz.createdAt
    ? new Date(buzz.createdAt)
    : null;

  const validDate =
    createdAt && !Number.isNaN(createdAt.getTime());

  const postedDate = validDate
    ? createdAt.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Community post';

  const typeLabels = {
    find: 'Sulit Find',
    sulit: 'Sulit Find',
    deal: 'Deal / Sale',
    sale: 'Deal / Sale',
    recommendation: 'Recommendation',
    advice: 'Tip & Advice',
  };

  return (
    <article className="bf-card">
      <div className="bf-card-image">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={buzz.product || buzz.title || 'Community find'}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            className="bf-image-placeholder"
            role="img"
            aria-label="No image available"
          >
            K
          </span>
        )}
      </div>

      <div className="bf-card-content">
        <div className="bf-card-meta">
          <span className={`bf-type bf-type-${type}`}>
            {typeLabels[type] || type}
          </span>

          <time dateTime={validDate ? createdAt.toISOString() : undefined}>
            {postedDate}
          </time>
        </div>

        <h3>{buzz.title || buzz.product || 'Community buzz'}</h3>

        {buzz.description && (
          <p className="bf-description">{buzz.description}</p>
        )}

        {(buzz.store || buzz.location) && (
          <div className="bf-store-line">
            <strong>{buzz.store || 'Community find'}</strong>
            {buzz.location && <span>{buzz.location}</span>}
          </div>
        )}

        <div className="bf-details">
          <span>
            {(buzz.category || 'general').replaceAll('-', ' ')}
          </span>

          {buzz.price && (
            <strong className="bf-price">
              {String(buzz.price).match(/[₱$]/)
                ? buzz.price
                : `₱${buzz.price}`}
            </strong>
          )}
        </div>

        <div className="bf-card-footer">
          <span>
            Posted by{' '}
            <strong>
              {buzz.author || buzz.user?.name || 'Kumarite'}
            </strong>
          </span>

          <div className="bf-actions">
            <span>
              Useful {Number(buzz.usefulCount || 0)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const loadProfile = useCallback(async (signal) => {
    const currentToken = localStorage.getItem('kumaritesToken');

    if (!currentToken) {
      window.location.assign(
        `/login?returnTo=${encodeURIComponent('/profile')}`
      );
      return;
    }

    const [profileResponse, buzzes] = await Promise.all([
      fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        signal,
      }),
      getCommunityBuzzes(),
    ]);

    const profileData = await profileResponse
      .json()
      .catch(() => ({}));

    if (!profileResponse.ok) {
      if (profileResponse.status === 401) {
        localStorage.removeItem('kumaritesToken');
        localStorage.removeItem('kumaritesUser');

        window.location.assign(
          `/login?returnTo=${encodeURIComponent('/profile')}`
        );

        return;
      }

      throw new Error(
        profileData.message || 'Unable to load your profile.'
      );
    }

    setProfile({
      ...profileData,
      allBuzzes: buzzes,
    });

    setError('');
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchProfile() {
      try {
        await loadProfile(controller.signal);
      } catch (loadError) {
        if (active && loadError.name !== 'AbortError') {
          setError(
            loadError.message || 'Unable to load your profile.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      active = false;
      controller.abort();
    };
  }, [loadProfile, reloadKey]);

  const savedBuzzes = profile?.savedBuzzes || [];

  const savedIds = new Set(
    savedBuzzes.map((buzz) => String(buzz.id ?? buzz._id))
  );

  const usefulIds = new Set(
    (profile?.usefulBuzzIds || []).map(String)
  );

  const usefulBuzzes = (profile?.allBuzzes || []).filter((buzz) =>
    usefulIds.has(String(buzz.id ?? buzz._id))
  );

  const authoredBuzzes = profile?.authoredBuzzes || [];

  function retryLoading() {
    setError('');
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  return (
    <>
      <Header activePage="profile" />

      <main className="profile-page">
        <section className="profile-hero">
          <p className="section-label">YOUR KUMARITES ACCOUNT</p>
          <h1>My Profile</h1>
          <p>
            Manage your account and find the Buzzes you have shared
            or saved.
          </p>
        </section>

        {loading ? (
          <p className="profile-status" role="status">
            Loading your account…
          </p>
        ) : error ? (
          <section className="profile-panel" role="alert">
            <p>{error}</p>
            <button type="button" onClick={retryLoading}>
              Try again
            </button>
          </section>
        ) : profile ? (
          <>
            <section className="profile-panel profile-account-card">
              <div className="profile-avatar" aria-hidden="true">
                {(profile.user?.name || 'K')
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>{profile.user?.name || 'Kumarite'}</h2>
                <p>{profile.user?.email}</p>

                <p className="profile-joined">
                  Member since{' '}
                  {profile.user?.createdAt
                    ? new Date(
                        profile.user.createdAt
                      ).toLocaleDateString('en-PH', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'recently'}
                </p>
              </div>
            </section>

            <section
              className="profile-stats"
              aria-label="Account activity"
            >
              <article>
                <strong>{authoredBuzzes.length}</strong>
                <span>Buzzes posted</span>
              </article>

              <article>
                <strong>{savedIds.size}</strong>
                <span>Buzzes saved</span>
              </article>

              <article>
                <strong>{usefulBuzzes.length}</strong>
                <span>Marked useful</span>
              </article>
            </section>

            <section className="profile-panel">
              <div className="profile-section-heading">
                <h2>My Buzzes</h2>
                <a href="/buzzfeed">Explore BuzzFeed</a>
              </div>

              {authoredBuzzes.length ? (
                <div className="profile-buzz-grid">
                  {authoredBuzzes.map((buzz, index) => (
                    <ProfileBuzzCard
                      key={
                        buzz.id ??
                        buzz._id ??
                        `${buzz.title}-${index}`
                      }
                      buzz={buzz}
                    />
                  ))}
                </div>
              ) : (
                <p className="profile-empty">
                  You have not published a Buzz yet.{' '}
                  <a href="/buzzfeed">Share your first find.</a>
                </p>
              )}
            </section>

            <section className="profile-panel">
              <div className="profile-section-heading">
                <h2>Saved Buzzes</h2>
                <a href="/categories">Browse categories</a>
              </div>

              {savedIds.size ? (
                <div className="profile-buzz-grid">
                  {savedBuzzes.map((buzz, index) => (
                    <ProfileBuzzCard
                      key={
                        buzz.id ??
                        buzz._id ??
                        `${buzz.title}-${index}`
                      }
                      buzz={buzz}
                    />
                  ))}
                </div>
              ) : (
                <p className="profile-empty">
                  No saved Buzzes yet. Use the Save action on a Buzz
                  to keep it here.
                </p>
              )}
            </section>

            <section className="profile-panel">
              <div className="profile-section-heading">
                <h2>Buzzes I Marked Useful</h2>
              </div>

              {usefulBuzzes.length ? (
                <div className="profile-buzz-grid">
                  {usefulBuzzes.map((buzz, index) => (
                    <ProfileBuzzCard
                      key={
                        buzz.id ??
                        buzz._id ??
                        `${buzz.title}-${index}`
                      }
                      buzz={buzz}
                    />
                  ))}
                </div>
              ) : (
                <p className="profile-empty">
                  You have not marked any Buzz as useful yet.
                </p>
              )}
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}