const databaseName = 'KumaritesDB';
const databaseVersion = 1;

const defaultBuzzes = [
  {
    type: 'sulit',
    category: 'grocery',
    store: 'ABC Grocery',
    product: 'Rice',
    title: 'Rice is cheaper here!',
    description: 'Found affordable rice at ABC Grocery. Good option for budget-conscious shoppers.',
    price: '48/kg',
    location: 'Cebu City',
    author: 'Maria S.',
    createdAt: '2026-09-28T04:00:00+08:00',
    image: 'Images/BuzzFeed Images/Cheap Rice.png',
    usefulCount: 24,
  },
  {
    type: 'sale',
    category: 'school-supplies',
    store: 'National Book Store',
    product: 'School Supplies',
    title: 'School supplies are on sale!',
    description: 'Selected school supplies are currently available at discounted prices.',
    price: 'Up to 30% OFF',
    location: 'Cebu City',
    author: 'Juan D.',
    createdAt: '2026-09-28T03:00:00+08:00',
    image: 'Images/BuzzFeed Images/School Supplies.png',
    usefulCount: 18,
  },
  {
    type: 'recommendation',
    category: 'food',
    store: 'Local Eats',
    product: 'Affordable Meals',
    title: 'Affordable meals near IT Park',
    description: 'Affordable meal options are available near IT Park for students and workers.',
    price: '99+',
    location: 'Cebu City',
    author: 'Andrea R.',
    createdAt: '2026-09-28T02:30:00+08:00',
    image: 'Images/BuzzFeed Images/Food.png',
    usefulCount: 31,
  },
  {
    type: 'sulit',
    category: 'grocery',
    store: 'SM Mall of Asia',
    product: 'Rice',
    title: '₱950 for 5kg Rice!',
    description: 'Found a good rice deal at SM Mall of Asia.',
    price: '950',
    location: 'Pasay City, Metro Manila',
    author: 'Kumarite',
    createdAt: '2026-09-28T02:00:00+08:00',
    image: 'Images/rice - latest buzzes.png',
    usefulCount: 0,
  },
  {
    type: 'sale',
    category: 'fashion',
    store: 'Gaisano Mall',
    product: 'Shoes',
    title: 'Up to 70% OFF on selected shoes!',
    description: 'Selected shoes are available at discounted prices.',
    price: 'Up to 70% OFF',
    location: 'Cebu City',
    author: 'Kumarite',
    createdAt: '2026-09-28T01:50:00+08:00',
    image: 'Images/shoes - latest buzzes.png',
    usefulCount: 0,
  },
  {
    type: 'sulit',
    category: 'school-supplies',
    store: 'Power Plant Mall',
    product: 'School Supplies',
    title: 'Affordable school supplies here!',
    description: 'Affordable school supplies are available for students.',
    price: '',
    location: 'Makati City',
    author: 'Kumarite',
    createdAt: '2026-09-28T01:40:00+08:00',
    image: 'Images/school supplies - latest buzzes.png',
    usefulCount: 0,
  },
  {
    type: 'recommendation',
    category: 'home-living',
    store: 'SM Megamall',
    product: 'Mall Visit',
    title: 'Less crowd in the morning!',
    description: 'Visiting SM Megamall early in the morning can help avoid larger crowds.',
    price: '',
    location: 'Mandaluyong City',
    author: 'Kumarite',
    createdAt: '2026-09-28T01:30:00+08:00',
    image: 'Images/less crowd - latest buzzess.png',
    usefulCount: 0,
  },
  {
    type: 'sale',
    category: 'grocery',
    store: 'Watsons',
    product: 'Dove Shampoo',
    title: 'Buy 1 Take 1 on Dove Shampoo!',
    description: 'Dove Shampoo is available under a Buy 1 Take 1 promotion.',
    price: 'Buy 1 Take 1',
    location: 'Cebu City',
    author: 'BudgetBuddy',
    createdAt: '2026-09-28T01:20:00+08:00',
    image: 'Images/Stores Images/DoveBuy1Take1.png',
    usefulCount: 24,
  },
  {
    type: 'sulit',
    category: 'food',
    store: 'Mang Inasal',
    product: 'Unli Rice',
    title: 'Unli Rice for ₱99 at Mang Inasal!',
    description: 'Check out the affordable meal option with unli rice.',
    price: '99',
    location: 'Cebu City',
    author: 'FoodieCebu',
    createdAt: '2026-09-28T01:10:00+08:00',
    image: 'Images/Stores Images/Mang Inasal.png',
    usefulCount: 18,
  },
  {
    type: 'recommendation',
    category: 'school-supplies',
    store: 'Miniso',
    product: 'School Supplies',
    title: 'Cute and affordable finds at Miniso',
    description: 'Found useful and affordable school-related items at Miniso.',
    price: '',
    location: 'Cebu City',
    author: 'FindsPH',
    createdAt: '2026-09-28T01:00:00+08:00',
    image: 'Images/Stores Images/Miniso.png',
    usefulCount: 31,
  },
  {
    type: 'advice',
    category: 'home-living',
    store: 'SM Mall of Asia',
    product: 'Parking',
    title: 'Go early to avoid parking hassle',
    description: 'Going early can help avoid parking difficulties during busy mall hours.',
    price: '',
    location: 'Pasay City, Metro Manila',
    author: 'FoodieeNakss',
    createdAt: '2026-09-28T00:50:00+08:00',
    image: 'Images/Stores Images/MallOfAsia.png',
    usefulCount: 12,
  },
];

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains('buzzes')) {
        const buzzes = database.createObjectStore('buzzes', {
          keyPath: 'id',
          autoIncrement: true,
        });

        buzzes.createIndex('type', 'type', { unique: false });
        buzzes.createIndex('category', 'category', { unique: false });
        buzzes.createIndex('store', 'store', { unique: false });
        buzzes.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!database.objectStoreNames.contains('images')) {
        database.createObjectStore('images', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('The Kumarites database is blocked by another open page.'));
  });
}

async function readBuzzes(database) {
  const transaction = database.transaction('buzzes', 'readonly');
  return requestResult(transaction.objectStore('buzzes').getAll());
}

async function seedMissingDefaultBuzzes(database) {
  await new Promise((resolve, reject) => {
    const transaction = database.transaction('buzzes', 'readwrite');
    const store = transaction.objectStore('buzzes');
    const request = store.getAll();

    request.onsuccess = () => {
      const existingTitles = new Set(request.result.map((buzz) => buzz.title));
      defaultBuzzes
        .filter((buzz) => !existingTitles.has(buzz.title))
        .forEach((buzz) => store.add(buzz));
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Unable to seed default Buzzes.'));
  });
}

async function hydrateBuzzImages(database, buzzes) {
  const imageStoreExists = database.objectStoreNames.contains('images');

  return Promise.all(buzzes.map(async (buzz) => {
    let image = '';
    if (buzz.image) {
      const imagePath = buzz.image.replace(/^(\.\.\/)+/, '');
      image = /^(blob:|data:|https?:\/\/|\/)/i.test(imagePath)
        ? imagePath
        : `/${imagePath.split('/').map(encodeURIComponent).join('/')}`;
    }

    if (buzz.imageId && imageStoreExists) {
      const transaction = database.transaction('images', 'readonly');
      const imageRecord = await requestResult(
        transaction.objectStore('images').get(buzz.imageId)
      );

      if (imageRecord?.blob) {
        image = URL.createObjectURL(imageRecord.blob);
      }
    }

    return { ...buzz, image };
  }));
}

export async function getStoreBuzzes() {
  const database = await openDatabase();

  try {
    await seedMissingDefaultBuzzes(database);
    const buzzes = await readBuzzes(database);
    const hydratedBuzzes = await hydrateBuzzImages(database, buzzes);

    return hydratedBuzzes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } finally {
    database.close();
  }
}

export async function updateBuzzUsefulCount(buzzId, usefulCount) {
  const database = await openDatabase();

  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('buzzes', 'readwrite');
      const store = transaction.objectStore('buzzes');
      const request = store.get(Number(buzzId));

      request.onsuccess = () => {
        if (!request.result) {
          transaction.abort();
          reject(new Error(`Buzz ${buzzId} was not found.`));
          return;
        }

        store.put({ ...request.result, usefulCount: Number(usefulCount) });
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Unable to update the Buzz.'));
    });
  } finally {
    database.close();
  }
}
