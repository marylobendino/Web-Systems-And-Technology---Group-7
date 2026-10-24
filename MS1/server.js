import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;

const stores = {
  moa: {
    id: 'moa',
    name: 'SM Mall of Asia',
    location: 'Pasay City, Metro Manila',
    description:
      'Shopping, dining, and more — discover the latest finds, promos, and experiences at SM Mall of Asia from the Kumarites community.',
    tags: ['Mall', 'Shopping', 'Food', 'Entertainment', 'Services'],
    stats: {
      buzzes: 42,
      visitors: '1.2K',
      rating: 4.6,
      ratings: 120,
    },
    about:
      'SM Mall of Asia is one of the largest malls in the Philippines, offering a wide range of shopping, dining, entertainment, and essential services.',
    address:
      'Seaside Blvd, Mall of Asia Complex, Pasay City, Metro Manila',
    hours: '10:00 AM - 10:00 PM (Daily)',
    phone: '(02) 8556-0680',
    website: 'https://www.smsupermalls.com',
  },
};

app.disable('x-powered-by');

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/stores', (_request, response) => {
  response.json({ stores: Object.values(stores) });
});

app.get('/api/stores/:slug', (request, response) => {
  const store = stores[request.params.slug];

  if (!store) {
    return response.status(404).json({ error: 'Store not found.' });
  }

  return response.json({ store });
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use(express.static(projectDirectory));

app.use((error, _request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  console.error('Express server error:', error);
  return response.status(500).send('An unexpected server error occurred.');
});

app.listen(port, () => {
  console.log(`Kumarites server running at http://localhost:${port}`);
});
