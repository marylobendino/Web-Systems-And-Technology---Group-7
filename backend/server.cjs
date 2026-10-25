
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const USERS_FILE = path.join(__dirname, "users.json");
const BUZZES_FILE = path.join(__dirname, "buzzes.json");
const BUZZES_SEED_FILE = path.join(__dirname, "buzzes.seed.json");

if (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "replace_this_with_a_long_random_secret") {
  throw new Error("Set a private, random JWT_SECRET in your .env file.");
}

app.disable("x-powered-by");
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "4mb" }));

// Existing categories API — preserved
const categories = [
  { id: "grocery", name: "Grocery" },
  { id: "food", name: "Food & Beverages" },
  { id: "fashion", name: "Fashion" },
  { id: "electronics", name: "Electronics" },
  { id: "school-supplies", name: "School Supplies" },
  { id: "home-living", name: "Home & Living" },
  { id: "services", name: "Services" }
];

const stores = [
  {
    id: "moa",
    name: "SM Mall of Asia",
    location: "Pasay City, Metro Manila",
    description:
      "Shopping, dining, and more — discover the latest finds, promos, and experiences at SM Mall of Asia from the Kumarites community.",
    tags: ["Mall", "Shopping", "Food", "Entertainment", "Services"],
    stats: {
      buzzes: 42,
      visitors: "1.2K",
      rating: 4.6,
      ratings: 120
    },
    about:
      "SM Mall of Asia is one of the largest malls in the Philippines, offering a wide range of shopping, dining, entertainment, and essential services.",
    address:
      "Seaside Blvd, Mall of Asia Complex, Pasay City, Metro Manila",
    hours: "10:00 AM - 10:00 PM (Daily)",
    phone: "(02) 8556-0680",
    website: "https://www.smsupermalls.com",
    mapUrl: "https://www.google.com/maps?q=SM+Mall+of+Asia&output=embed",
    popularCategories: [
      { name: "Food & Beverages", count: 12 },
      { name: "Fashion", count: 10 },
      { name: "Services", count: 6 },
      { name: "Electronics", count: 5 },
      { name: "Home & Living", count: 4 },
      { name: "School Supplies", count: 3 }
    ]
  }
];

// Read local development accounts
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const records = JSON.parse(data);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// Write through a temporary file to avoid leaving a partial JSON document.
async function saveUsers(users) {
  const temporaryFile = `${USERS_FILE}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(users, null, 2), "utf8");
  await fs.rename(temporaryFile, USERS_FILE);
}

// File-backed persistence is suitable for this coursework milestone.
// For multi-user production deployments, use a transactional database.
async function readBuzzes() {
  try {
    const contents = await fs.readFile(BUZZES_FILE, "utf8");
    const records = JSON.parse(contents);
    if (Array.isArray(records) && records.length > 0) return records;
    return await readSeedBuzzes();
  } catch (error) {
    if (error.code === "ENOENT") return await readSeedBuzzes();
    throw error;
  }
}

async function readSeedBuzzes() {
  try {
    const contents = await fs.readFile(BUZZES_SEED_FILE, "utf8");
    const records = JSON.parse(contents);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveBuzzes(buzzes) {
  const temporaryFile = `${BUZZES_FILE}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(buzzes, null, 2), "utf8");
  await fs.rename(temporaryFile, BUZZES_FILE);
}

// Serialize file-backed mutations so simultaneous posts/Useful clicks do not overwrite one another.
let buzzWriteQueue = Promise.resolve();
function withBuzzWriteLock(operation) {
  const result = buzzWriteQueue.then(operation, operation);
  buzzWriteQueue = result.catch(() => {});
  return result;
}

function requireAuth(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Sign in to continue." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired. Please sign in again." });
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "kumarites-categories-api"
  });
});

app.get("/api/categories", (req, res) => {
  res.json({
    count: categories.length,
    categories
  });
});

app.get("/api/stores", (req, res) => {
  res.json({
    count: stores.length,
    stores
  });
});

app.get("/api/stores/:slug", (req, res) => {
  const store = stores.find(item => item.id === req.params.slug);

  if (!store) {
    return res.status(404).json({
      message: "Store not found."
    });
  }

  return res.json({ store });
});

app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Authentication routes are reachable." });
});

// Sign up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid name and email, and a password between 8 and 72 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = await readUsers();

    if (users.some(user => user.email === normalizedEmail)) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    await saveUsers(users);

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      message: "Unable to create the account right now."
    });
  }
});

// Log in
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = await readUsers();

    const user = users.find(
      item => item.email === normalizedEmail
    );

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Unable to log in right now."
    });
  }
});

// GET /api/buzzes supports optional query filtering without exposing user records.
app.get("/api/buzzes", async (req, res) => {
  try {
    let viewerId = null;
    const authorization = req.get("authorization") || "";
    const [scheme, token] = authorization.split(" ");
    if (scheme === "Bearer" && token) {
      try { viewerId = jwt.verify(token, process.env.JWT_SECRET).sub || null; } catch { viewerId = null; }
    }
    const buzzes = await readBuzzes();
    const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim().toLowerCase() : "";
    const filtered = buzzes.filter((buzz) => {
      const matchesQuery = !query || [buzz.title, buzz.description, buzz.store, buzz.location, buzz.author]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const matchesCategory = !category || String(buzz.category || "").toLowerCase() === category;
      return matchesQuery && matchesCategory;
    });
    const visibleBuzzes = filtered.map((buzz) => {
      const { usefulBy = [], savedBy = [], ...publicBuzz } = buzz;
      return {
        ...publicBuzz,
        isUsefulByMe: Boolean(viewerId && usefulBy.includes(viewerId)),
        isSavedByMe: Boolean(viewerId && savedBy.includes(viewerId))
      };
    });
    return res.json({ count: visibleBuzzes.length, buzzes: visibleBuzzes });
  } catch (error) {
    console.error("Read buzzes error:", error.message);
    return res.status(500).json({ message: "Unable to retrieve community buzzes." });
  }
});

// POST /api/buzzes demonstrates receiving JSON request-body data and persisting it.
app.post("/api/buzzes", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "find";
    const store = typeof body.store === "string" ? body.store.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const price = body.price == null ? "" : String(body.price).trim();
    const imageData = typeof body.imageData === "string" ? body.imageData : "";
    if (imageData && (!/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(imageData) || imageData.length > 3_000_000)) {
      return res.status(400).json({ message: "Choose a supported image no larger than 2 MB." });
    }

    if (title.length < 3 || title.length > 120) {
      return res.status(400).json({ message: "Title must be between 3 and 120 characters." });
    }
    if (description.length < 10 || description.length > 2000) {
      return res.status(400).json({ message: "Description must be between 10 and 2,000 characters." });
    }
    if (!category || category.length > 60) {
      return res.status(400).json({ message: "A valid category is required." });
    }
    if (!["find", "deal", "sale", "recommendation", "advice", "sulit"].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Choose a supported buzz type." });
    }
    if (store.length > 120 || location.length > 160 || price.length > 40) {
      return res.status(400).json({ message: "Store, location, or price exceeds the allowed length." });
    }

    const users = await readUsers();
    const author = users.find((user) => user.id === req.user.id);
    const record = {
      id: randomUUID(),
      title,
      description,
      category: category.toLowerCase(),
      type: type.toLowerCase(),
      store,
      location,
      price,
      imageData,
      author: author?.name || "Kumarite",
      userId: req.user.id,
      usefulBy: [],
      savedBy: [],
      usefulCount: 0,
      createdAt: new Date().toISOString()
    };

    await withBuzzWriteLock(async () => {
      const buzzes = await readBuzzes();
      buzzes.unshift(record);
      await saveBuzzes(buzzes);
    });
    return res.status(201).json({ message: "Buzz published successfully.", buzz: record });
  } catch (error) {
    console.error("Create buzz error:", error.message);
    return res.status(500).json({ message: "Unable to publish your buzz right now." });
  }
});

// Return the authenticated account's profile, own posts, saved posts, and Useful actions.
app.get("/api/users/me", requireAuth, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find((item) => item.id === req.user.id);
    if (!user) return res.status(404).json({ message: "Account not found." });

    const buzzes = await readBuzzes();
    const savedBuzzes = buzzes.filter((buzz) => Array.isArray(buzz.savedBy) && buzz.savedBy.includes(req.user.id));
    const usefulBuzzIds = buzzes
      .filter((buzz) => Array.isArray(buzz.usefulBy) && buzz.usefulBy.includes(req.user.id))
      .map((buzz) => buzz.id);

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      authoredBuzzes: buzzes.filter((buzz) => buzz.userId === req.user.id).map(({ usefulBy, savedBy, ...buzz }) => buzz),
      savedBuzzes: savedBuzzes.map(({ usefulBy, savedBy, ...buzz }) => buzz),
      usefulBuzzIds
    });
  } catch (error) {
    console.error("Read profile error:", error.message);
    return res.status(500).json({ message: "Unable to retrieve your profile." });
  }
});

// Useful actions are account-associated and idempotent: one user can mark a Buzz useful once.
app.patch("/api/buzzes/:id/useful", requireAuth, async (req, res) => {
  const delta = req.body?.delta;
  if (delta !== 1 && delta !== -1) {
    return res.status(400).json({ message: "Useful count delta must be +1 or -1." });
  }

  try {
    const updatedBuzz = await withBuzzWriteLock(async () => {
      const buzzes = await readBuzzes();
      const index = buzzes.findIndex((buzz) => String(buzz.id) === req.params.id);
      if (index < 0) return null;
      const buzz = { ...buzzes[index] };
      const usefulBy = Array.isArray(buzz.usefulBy) ? [...buzz.usefulBy] : [];
      const alreadyUseful = usefulBy.includes(req.user.id);
      const currentCount = Math.max(0, Number(buzz.usefulCount) || 0);

      if (delta === 1 && !alreadyUseful) {
        usefulBy.push(req.user.id);
        buzz.usefulCount = currentCount + 1;
      } else if (delta === -1 && alreadyUseful) {
        buzz.usefulBy = usefulBy.filter((id) => id !== req.user.id);
        buzz.usefulCount = Math.max(0, currentCount - 1);
      }

      buzz.usefulBy = delta === -1 && alreadyUseful
        ? buzz.usefulBy
        : usefulBy;
      buzzes[index] = buzz;
      await saveBuzzes(buzzes);
      return buzz;
    });

    if (!updatedBuzz) return res.status(404).json({ message: "Buzz not found." });
    const { usefulBy = [], savedBy = [], ...publicBuzz } = updatedBuzz;
    return res.json({ message: "Useful count updated.", buzz: publicBuzz, isUseful: usefulBy.includes(req.user.id) });
  } catch (error) {
    console.error("Update Useful count error:", error.message);
    return res.status(500).json({ message: "Unable to update the Useful count." });
  }
});

// Save/unsave a Buzz to the signed-in account.
app.patch("/api/buzzes/:id/saved", requireAuth, async (req, res) => {
  if (typeof req.body?.saved !== "boolean") {
    return res.status(400).json({ message: "Provide saved as true or false." });
  }

  try {
    const result = await withBuzzWriteLock(async () => {
      const buzzes = await readBuzzes();
      const index = buzzes.findIndex((buzz) => String(buzz.id) === req.params.id);
      if (index < 0) return null;
      const buzz = { ...buzzes[index] };
      const savedBy = Array.isArray(buzz.savedBy) ? [...buzz.savedBy] : [];
      const hasSaved = savedBy.includes(req.user.id);
      if (req.body.saved && !hasSaved) savedBy.push(req.user.id);
      if (!req.body.saved && hasSaved) savedBy.splice(savedBy.indexOf(req.user.id), 1);
      buzz.savedBy = savedBy;
      buzzes[index] = buzz;
      await saveBuzzes(buzzes);
      return buzz;
    });

    if (!result) return res.status(404).json({ message: "Buzz not found." });
    const { usefulBy = [], savedBy = [], ...publicBuzz } = result;
    return res.json({ message: "Saved Buzz updated.", buzz: publicBuzz, isSaved: savedBy.includes(req.user.id) });
  } catch (error) {
    console.error("Update saved Buzz error:", error.message);
    return res.status(500).json({ message: "Unable to update saved Buzzes." });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

async function seedDemoAccount() {
  if (process.env.NODE_ENV === "production" || process.env.SEED_DEMO_ACCOUNT !== "true") return;
  const email = (process.env.DEMO_ACCOUNT_EMAIL || "evaluator@kumarites.local").trim().toLowerCase();
  const password = process.env.DEMO_ACCOUNT_PASSWORD || "KumaritesDemo2026!";
  const users = await readUsers();
  if (users.some((user) => user.email === email)) return;
  users.push({
    id: randomUUID(),
    name: "Kumarites Evaluator",
    email,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString()
  });
  await saveUsers(users);
  console.log(`Development evaluator account seeded: ${email}`);
}

seedDemoAccount()
  .then(() => {
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`Kumarites API running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to initialize development data:", error.message);
    process.exitCode = 1;
  });