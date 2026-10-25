import { useEffect, useMemo, useState } from 'react';
import { getCommunityBuzzes, updateBuzzUsefulCount, updateBuzzSaved } from '../data/buzzes.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CreateBuzzModal from '../components/CreateBuzzModal.jsx';
const TYPES = [
  { value: 'all', label: 'All Buzzes' },
  { value: 'find', label: 'Sulit Finds', matches: ['sulit', 'find'] },
  { value: 'deal', label: 'Deals & Sales', matches: ['sale', 'deal'] },
  { value: 'recommendation', label: 'Recommendations' },
  { value: 'advice', label: 'Tips & Advice' },
];
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Food' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'school-supplies', label: 'School Supplies' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home-living', label: 'Home & Living' },
  { value: 'services', label: 'Services' },
];
const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Useful' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

function getImagePath(image) {
  if (!image) return '';
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  // getCommunityBuzzes already normalizes local paths to a leading slash
  // and URL-encodes path segments. Do not encode those segments twice.
  if (image.startsWith('/')) return image;
  return `/${image.split('/').map(encodeURIComponent).join('/')}`;
}
function numericPrice(price) {
  if (typeof price === 'number') return price;
  const match = String(price ?? '').replace(/,/g, '').match(/[\d]+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}
function postedLabel(date) {
  if (!date) return 'Community post';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'Community post' : parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
function preferenceKey(buzz, kind) {
  if (kind === 'useful' && buzz.id) return `kumaritesUseful_v2_${buzz.id}`;
  if (kind === 'saved' && buzz.id) return `kumaritesSaved_${buzz.id}`;
  return `kumarites:buzzfeed:${kind}:${buzz.id ?? `${buzz.category}-${buzz.title}-${buzz.createdAt}`}`;
}
function readPreference(key) {
  try { return localStorage.getItem(key) === 'true'; } catch { return false; }
}
function savePreference(key, value) {
  try {
    if (value) localStorage.setItem(key, 'true');
    else localStorage.removeItem(key);
  } catch { /* Keep this session usable when storage is unavailable. */ }
}

function BuzzCard({ buzz, onUseful }) {
  const usefulKey = preferenceKey(buzz, 'useful');
  const savedKey = preferenceKey(buzz, 'saved');
  const [useful, setUseful] = useState(() => typeof buzz.isUsefulByMe === 'boolean' ? buzz.isUsefulByMe : readPreference(usefulKey));
  const [saved, setSaved] = useState(() => typeof buzz.isSavedByMe === 'boolean' ? buzz.isSavedByMe : readPreference(savedKey));
  const [imageFailed, setImageFailed] = useState(false);
  const [actionError, setActionError] = useState('');
  const type = String(buzz.type || 'find').toLowerCase();
  const image = getImagePath(buzz.imageData || buzz.image);
  const usefulCount = Number(buzz.usefulCount || 0);

  async function toggleUseful() {
    const next = !useful;
    setActionError('');
    setUseful(next);
    savePreference(usefulKey, next);
    try {
      await onUseful?.(buzz, next ? 1 : -1);
    } catch (error) {
      setUseful(!next);
      savePreference(usefulKey, !next);
      console.error('Unable to update Useful count:', error);
      setActionError(error.message || 'Unable to update Useful count. Please try again.');
    }
  }
  async function toggleSaved() {
    const next = !saved;
    setActionError('');
    try {
      await updateBuzzSaved(buzz.id, next);
      setSaved(next);
      savePreference(savedKey, next);
    } catch (error) {
      setActionError(error.message || 'Unable to save this Buzz. Please sign in and try again.');
    }
  }

  return (
    <article className="bf-card">
      <div className="bf-card-image">
        {image && !imageFailed ? <img src={image} alt={buzz.product || buzz.title || 'Community find'} loading="lazy" onError={() => setImageFailed(true)} /> : <span className="bf-image-placeholder" aria-label="No image available">K</span>}
      </div>
      <div className="bf-card-content">
        <div className="bf-card-meta">
          <span className={`bf-type bf-type-${type}`}>{type === 'sulit' ? 'Sulit Find' : type === 'sale' ? 'Deal / Sale' : type === 'recommendation' ? 'Recommendation' : type === 'advice' ? 'Tip & Advice' : type}</span>
          <time>{postedLabel(buzz.createdAt)}</time>
        </div>
        <h3>{buzz.title || buzz.product || 'Community buzz'}</h3>
        {buzz.description && <p className="bf-description">{buzz.description}</p>}
        {(buzz.store || buzz.location) && <div className="bf-store-line"><strong>{buzz.store || 'Community find'}</strong>{buzz.location && <span>{buzz.location}</span>}</div>}
        <div className="bf-details"><span>{(buzz.category || 'general').replaceAll('-', ' ')}</span>{buzz.price && <strong className="bf-price">{String(buzz.price).match(/[₱$]/) ? buzz.price : `₱${buzz.price}`}</strong>}</div>
        <div className="bf-card-footer"><span>Posted by <strong>{buzz.author || 'Kumarite'}</strong></span><div className="bf-actions">
          <button type="button" className={useful ? 'is-active' : ''} aria-pressed={useful} onClick={toggleUseful}>{useful ? '♥' : '♡'} Useful <span>{usefulCount}</span></button>
          <button type="button" className={saved ? 'is-saved' : ''} aria-pressed={saved} onClick={toggleSaved}>{saved ? 'Saved ✓' : 'Save'}</button>
        </div></div>
        {actionError && <p className="bf-action-error" role="alert">{actionError}</p>}
      </div>
    </article>
  );
}

export default function BuzzFeed() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [allBuzzes, setAllBuzzes] = useState([]);
  const [loadingBuzzes, setLoadingBuzzes] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBuzzes() {
      try {
        const loadedBuzzes = await getCommunityBuzzes();
        if (!cancelled) {
          setAllBuzzes(loadedBuzzes);
          setFeedError('');
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to load community posts:', error);
          setFeedError('Unable to refresh community posts. Please try again.');
        }
      } finally {
        if (!cancelled) setLoadingBuzzes(false);
      }
    }

    loadBuzzes();
    const intervalId = window.setInterval(loadBuzzes, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  async function handleUseful(buzz, delta) {
    const updatedBuzz = await updateBuzzUsefulCount(buzz.id, delta);
    setAllBuzzes((current) => current.map((item) => (
      item.id === updatedBuzz.id ? updatedBuzz : item
    )));
  }

  const buzzes = useMemo(() => {
    let list = [...allBuzzes];
    const term = query.trim().toLocaleLowerCase();
    if (term) list = list.filter((buzz) => [buzz.title, buzz.description, buzz.product, buzz.store, buzz.location, buzz.author, buzz.category, buzz.type].some((value) => String(value ?? '').toLocaleLowerCase().includes(term)));
    if (typeFilter !== 'all') {
      const selected = TYPES.find((item) => item.value === typeFilter);
      list = list.filter((buzz) => selected?.matches ? selected.matches.includes(String(buzz.type).toLowerCase()) : String(buzz.type).toLowerCase() === typeFilter);
    }
    if (categoryFilter !== 'all') list = list.filter((buzz) => String(buzz.category).toLowerCase() === categoryFilter);
    list.sort((a, b) => {
      if (sort === 'popular') return Number(b.usefulCount || 0) - Number(a.usefulCount || 0);
      if (sort === 'price-low') return numericPrice(a.price) - numericPrice(b.price);
      if (sort === 'price-high') return numericPrice(b.price) - numericPrice(a.price);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return list;
  }, [allBuzzes, query, typeFilter, categoryFilter, sort]);

  function resetFilters() { setQuery(''); setTypeFilter('all'); setCategoryFilter('all'); setSort('latest'); }
  function requestCreateBuzz() {
    if (!localStorage.getItem('kumaritesToken')) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setShowCreateForm(true);
  }


  return <div className="buzzfeed-page">
    <Header activePage="buzzfeed" searchValue={query} onSearchChange={setQuery} />

    <main>
      <section className="bf-hero"><div><p className="bf-eyebrow">THE COMMUNITY FEED</p><h1>What's <span>Buzzing?</span></h1><p>Discover real finds, deals, recommendations, and helpful tsika shared by the community.</p><button className="bf-primary" type="button" onClick={requestCreateBuzz}>＋ Create a Buzz</button></div><div className="bf-hero-art" aria-hidden="true"><span className="bf-art-bubble bf-bubble-one">Sulit!</span><span className="bf-art-bubble bf-bubble-two">₱</span><span className="bf-art-bubble bf-bubble-three">★</span><div className="bf-art-card"><span>COMMUNITY FINDS</span><strong>Good deals are better when shared.</strong><div className="bf-art-bars"><i/><i/><i/></div></div></div></section>
      {feedError && <div className="bf-notice" role="status">{feedError}</div>}
      <section className="bf-layout" aria-label="Buzz feed">
        <aside className="bf-filter-panel"><h2>Filter Buzzes</h2><fieldset className="bf-filter-group"><legend>Buzz Type</legend>{TYPES.map((item) => <label key={item.value}><input type="radio" name="bf-type" value={item.value} checked={typeFilter === item.value} onChange={() => setTypeFilter(item.value)} /><span>{item.label}</span></label>)}</fieldset><fieldset className="bf-filter-group"><legend>Category</legend>{CATEGORIES.map((item) => <label key={item.value}><input type="radio" name="bf-category" value={item.value} checked={categoryFilter === item.value} onChange={() => setCategoryFilter(item.value)} /><span>{item.label}</span></label>)}</fieldset><div className="bf-filter-group"><label className="bf-select-label" htmlFor="bf-sidebar-sort">Sort Buzzes</label><select id="bf-sidebar-sort" value={sort} onChange={(event) => setSort(event.target.value)}>{SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><button className="bf-clear" type="button" onClick={resetFilters}>Clear all filters</button></aside>
        <section className="bf-feed" aria-labelledby="bf-feed-title"><div className="bf-feed-heading"><div><h2 id="bf-feed-title">Latest Buzzes</h2><p>{buzzes.length} {buzzes.length === 1 ? 'post' : 'posts'} match your filters</p></div><label htmlFor="bf-search">Search <input id="bf-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search buzzes…" /></label></div>
          {loadingBuzzes && <p className="bf-feed-status" role="status">Loading community posts…</p>}{buzzes.length ? <div className="bf-buzz-list">{buzzes.map((buzz, index) => <BuzzCard key={buzz.id ?? `${buzz.category}-${buzz.title}-${buzz.createdAt}-${index}`} buzz={buzz} onUseful={handleUseful} />)}</div> : <div className="bf-empty"><span aria-hidden="true">⌕</span><h3>No buzzes found</h3><p>Try a different search term or clear your filters to see more community posts.</p><button className="bf-primary" type="button" onClick={resetFilters}>Reset filters</button></div>}
        </section>
        <aside className="bf-right-sidebar"><section className="bf-side-card"><h2>Trending Stores</h2><div className="bf-trending-store"><span className="bf-store-icon">W</span><div><strong>Watsons</strong><span>Beauty & personal care</span></div></div><div className="bf-trending-store"><span className="bf-store-icon">N</span><div><strong>National Book Store</strong><span>Books & school supplies</span></div></div><div className="bf-trending-store"><span className="bf-store-icon">M</span><div><strong>Mang Inasal</strong><span>Food & dining</span></div></div><a className="bf-side-link" href="/stores">Explore all stores →</a></section><section className="bf-side-cta"><h2>Know a sulit find?</h2><p>Help the community discover useful deals, local finds, and practical tips.</p><button type="button" className="bf-primary" onClick={requestCreateBuzz}>＋ Share a Buzz</button></section><section className="bf-side-card bf-tip"><span>COMMUNITY TIP</span><h2>Share the details</h2><p>Include the store, price, location, and date so other Kumarites can verify whether a deal is still available.</p></section></aside>
      </section>
    </main>
    {showCreateForm && <CreateBuzzModal onClose={() => setShowCreateForm(false)} onPublished={async (buzz) => { if (buzz) setAllBuzzes(current => [buzz, ...current.filter(item => item.id !== buzz.id)]); try { setAllBuzzes(await getCommunityBuzzes()); } catch (error) { console.error('Unable to refresh after publishing:', error); } }} />}
    <Footer />
  </div>;
}