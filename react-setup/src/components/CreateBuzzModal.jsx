import { useState } from 'react';

const initialForm = { title: '', description: '', category: 'food', type: 'find', store: '', location: '', price: '', imageData: '' };
const categoryOptions = ['food', 'grocery', 'school-supplies', 'fashion', 'electronics', 'home-living', 'services'];

export default function CreateBuzzModal({ onClose, onPublished }) {
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageName, setImageName] = useState('');

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Choose a JPG, PNG, WEBP, or GIF image.');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm(current => ({ ...current, imageData: String(reader.result || '') }));
      setImageName(file.name);
    };
    reader.onerror = () => setError('Unable to read this image. Please choose another file.');
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setForm(current => ({ ...current, imageData: '' }));
    setImageName('');
  }

  async function submit(event) {
    event.preventDefault();
    setError(''); setSuccess('');
    const token = localStorage.getItem('kumaritesToken');
    if (!token) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/buzzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) localStorage.removeItem('kumaritesToken');
        throw new Error(data.message || 'Unable to publish your buzz. Please try again.');
      }
      setSuccess('Your buzz was published successfully.');
      onPublished?.(data.buzz);
      window.setTimeout(onClose, 900);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Cannot reach the backend. Please try again when the server is running.' : err.message);
    } finally { setBusy(false); }
  }

  return <div className="create-buzz-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="create-buzz-dialog" role="dialog" aria-modal="true" aria-labelledby="create-buzz-modal-title">
      <button type="button" className="create-buzz-modal-close" onClick={onClose} aria-label="Close form">×</button>
      <p className="create-buzz-modal-eyebrow">COMMUNITY CONTRIBUTION</p>
      <h2 id="create-buzz-modal-title">Share a Buzz</h2>
      <p className="create-buzz-modal-intro">Help other Kumarites discover useful finds and deals.</p>
      <form onSubmit={submit} className="create-buzz-modal-form">
        <label>Title<input name="title" value={form.title} onChange={e => setForm({...form, title:e.target.value})} minLength={3} maxLength={120} required /></label>
        <label>Buzz type<select name="type" value={form.type} onChange={e => setForm({...form,type:e.target.value})}><option value="find">Sulit find</option><option value="deal">Deal</option><option value="sale">Sale / promo</option><option value="recommendation">Recommendation</option><option value="advice">Tip & advice</option></select></label>
        <label>Category<select name="category" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{categoryOptions.map(v => <option key={v} value={v}>{v.replaceAll('-', ' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}</select></label>
        <label>Store<input name="store" value={form.store} onChange={e => setForm({...form,store:e.target.value})} maxLength={120} placeholder="e.g. SM Mall of Asia" /></label>
        <label>Location<input name="location" value={form.location} onChange={e => setForm({...form,location:e.target.value})} maxLength={160} placeholder="Branch or area" /></label>
        <label>Price (₱)<input name="price" value={form.price} onChange={e => setForm({...form,price:e.target.value})} maxLength={40} inputMode="decimal" placeholder="e.g. 199" /></label>
        <label className="create-buzz-modal-photo">Photo (optional)<input type="file" name="photo" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} /><small>JPG, PNG, WEBP, or GIF · maximum 2 MB</small>{form.imageData && <span className="create-buzz-photo-preview"><img src={form.imageData} alt="Preview of the selected buzz" /><button type="button" onClick={removeImage}>Remove photo</button><span>{imageName}</span></span>}</label>
        <label className="create-buzz-modal-description">Description<textarea name="description" value={form.description} onChange={e => setForm({...form,description:e.target.value})} minLength={10} maxLength={2000} rows={4} required placeholder="What did you find, and why is it useful?" /></label>
        {error && <p className="create-buzz-modal-error" role="alert">{error}</p>}{success && <p className="create-buzz-modal-success" role="status">{success}</p>}
        <div className="create-buzz-modal-actions"><button type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Publish Buzz'}</button><button type="button" className="create-buzz-cancel" onClick={onClose}>Cancel</button></div>
      </form>
    </section>
  </div>;
}
