/**
 * Central Buzz data access module.
 * Published Buzzes and shared Useful counts are persisted by the Express API.
 * defaultBuzzes is demo/seed content only; pages should render getCommunityBuzzes().
 */
export const defaultBuzzes = [
  {
    "type": "sulit",
    "category": "grocery",
    "store": "ABC Grocery",
    "product": "Rice",
    "title": "Rice is cheaper here!",
    "description": "Found affordable rice at ABC Grocery. Good option for budget-conscious shoppers.",
    "price": "48/kg",
    "location": "Cebu City",
    "author": "Maria S.",
    "createdAt": "2026-09-28T04:00:00+08:00",
    "image": "Images/BuzzFeed Images/Cheap Rice.png",
    "usefulCount": 24
  },
  {
    "type": "sale",
    "category": "school-supplies",
    "store": "National Book Store",
    "product": "School Supplies",
    "title": "School supplies are on sale!",
    "description": "Selected school supplies are currently available at discounted prices.",
    "price": "Up to 30% OFF",
    "location": "Cebu City",
    "author": "Juan D.",
    "createdAt": "2026-09-28T03:00:00+08:00",
    "image": "Images/BuzzFeed Images/School Supplies.png",
    "usefulCount": 18
  },
  {
    "type": "recommendation",
    "category": "food",
    "store": "Local Eats",
    "product": "Affordable Meals",
    "title": "Affordable meals near IT Park",
    "description": "Affordable meal options are available near IT Park for students and workers.",
    "price": "99+",
    "location": "Cebu City",
    "author": "Andrea R.",
    "createdAt": "2026-09-28T02:30:00+08:00",
    "image": "Images/BuzzFeed Images/Food.png",
    "usefulCount": 31
  },
  {
    "type": "sulit",
    "category": "grocery",
    "store": "SM Mall of Asia",
    "product": "Rice",
    "title": "₱950 for 5kg Rice!",
    "description": "Found a good rice deal at SM Mall of Asia.",
    "price": "950",
    "location": "Pasay City, Metro Manila",
    "author": "Kumarite",
    "createdAt": "2026-09-28T02:00:00+08:00",
    "image": "Images/rice - latest buzzes.png",
    "usefulCount": 0
  },
  {
    "type": "sale",
    "category": "fashion",
    "store": "Gaisano Mall",
    "product": "Shoes",
    "title": "Up to 70% OFF on selected shoes!",
    "description": "Selected shoes are available at discounted prices.",
    "price": "Up to 70% OFF",
    "location": "Cebu City",
    "author": "Kumarite",
    "createdAt": "2026-09-28T01:50:00+08:00",
    "image": "Images/shoes - latest buzzes.png",
    "usefulCount": 0
  },
  {
    "type": "sulit",
    "category": "school-supplies",
    "store": "Power Plant Mall",
    "product": "School Supplies",
    "title": "Affordable school supplies here!",
    "description": "Affordable school supplies are available for students.",
    "price": "",
    "location": "Makati City",
    "author": "Kumarite",
    "createdAt": "2026-09-28T01:40:00+08:00",
    "image": "Images/school supplies - latest buzzes.png",
    "usefulCount": 0
  },
  {
    "type": "recommendation",
    "category": "home-living",
    "store": "SM Megamall",
    "product": "Mall Visit",
    "title": "Less crowd in the morning!",
    "description": "Visiting SM Megamall early in the morning can help avoid larger crowds.",
    "price": "",
    "location": "Mandaluyong City",
    "author": "Kumarite",
    "createdAt": "2026-09-28T01:30:00+08:00",
    "image": "Images/less crowd - latest buzzess.png",
    "usefulCount": 0
  },
  {
    "type": "sale",
    "category": "grocery",
    "store": "Watsons",
    "product": "Dove Shampoo",
    "title": "Buy 1 Take 1 on Dove Shampoo!",
    "description": "Dove Shampoo is available under a Buy 1 Take 1 promotion.",
    "price": "Buy 1 Take 1",
    "location": "Cebu City",
    "author": "BudgetBuddy",
    "createdAt": "2026-09-28T01:20:00+08:00",
    "image": "Images/Stores Images/DoveBuy1Take1.png",
    "usefulCount": 24
  },
  {
    "type": "sulit",
    "category": "food",
    "store": "Mang Inasal",
    "product": "Unli Rice",
    "title": "Unli Rice for ₱99 at Mang Inasal!",
    "description": "Check out the affordable meal option with unli rice.",
    "price": "99",
    "location": "Cebu City",
    "author": "FoodieCebu",
    "createdAt": "2026-09-28T01:10:00+08:00",
    "image": "Images/Stores Images/Mang Inasal.png",
    "usefulCount": 18
  },
  {
    "type": "recommendation",
    "category": "school-supplies",
    "store": "Miniso",
    "product": "School Supplies",
    "title": "Cute and affordable finds at Miniso",
    "description": "Found useful and affordable school-related items at Miniso.",
    "price": "",
    "location": "Cebu City",
    "author": "FindsPH",
    "createdAt": "2026-09-28T01:00:00+08:00",
    "image": "Images/Stores Images/Miniso.png",
    "usefulCount": 31
  },
  {
    "type": "advice",
    "category": "home-living",
    "store": "SM Mall of Asia",
    "product": "Parking",
    "title": "Go early to avoid parking hassle",
    "description": "Going early can help avoid parking difficulties during busy mall hours.",
    "price": "",
    "location": "Pasay City, Metro Manila",
    "author": "FoodieeNakss",
    "createdAt": "2026-09-28T00:50:00+08:00",
    "image": "Images/Stores Images/MallOfAsia.png",
    "usefulCount": 12
  }
];

function normalizeImagePath(image) {
  if (!image) return '';
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  if (image.startsWith('/')) return image;
  return `/${image.split('/').map(encodeURIComponent).join('/')}`;
}

function normalizeBuzz(buzz) {
  const rawImage = buzz.imageData || buzz.image || '';
  return {
    ...buzz,
    image: normalizeImagePath(rawImage),
    type: ({ find: 'sulit', deal: 'sale' })[String(buzz.type || 'find').toLowerCase()]
      || String(buzz.type || 'find').toLowerCase(),
  };
}

export async function getCommunityBuzzes({ signal } = {}) {
  const token = localStorage.getItem('kumaritesToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch('/api/buzzes', { signal, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load community Buzzes.');
  }
  const data = await response.json();
  const buzzes = Array.isArray(data.buzzes) ? data.buzzes : [];
  return buzzes.map(normalizeBuzz);
}

/**
 * Apply a shared Useful-count delta through the API.
 * delta must be +1 or -1. A valid session is required.
 */
export async function updateBuzzUsefulCount(buzzId, delta) {
  if (!buzzId) throw new Error('A Buzz ID is required.');
  if (delta !== 1 && delta !== -1) {
    throw new Error('Useful-count delta must be +1 or -1.');
  }
  const token = localStorage.getItem('kumaritesToken');
  if (!token) throw new Error('Sign in to mark a Buzz as useful.');

  const response = await fetch(`/api/buzzes/${encodeURIComponent(buzzId)}/useful`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delta }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('kumaritesToken');
    throw new Error(data.message || 'Unable to update the Useful count.');
  }
  return { ...normalizeBuzz(data.buzz), isUsefulByMe: Boolean(data.isUseful) };
}


/** Persist a saved/unsaved action against the signed-in account. */
export async function updateBuzzSaved(buzzId, saved) {
  if (!buzzId) throw new Error('A Buzz ID is required.');
  if (typeof saved !== 'boolean') throw new Error('Saved state must be true or false.');
  const token = localStorage.getItem('kumaritesToken');
  if (!token) throw new Error('Sign in to save a Buzz.');

  const response = await fetch(`/api/buzzes/${encodeURIComponent(buzzId)}/saved`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ saved }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('kumaritesToken');
    throw new Error(data.message || 'Unable to update saved Buzzes.');
  }
  return { buzz: normalizeBuzz(data.buzz), isSaved: Boolean(data.isSaved) };
}
