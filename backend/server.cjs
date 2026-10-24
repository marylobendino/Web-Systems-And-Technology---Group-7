
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

if (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "replace_this_with_a_long_random_secret") {
  throw new Error("Set a private, random JWT_SECRET in your .env file.");
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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
  const data = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(data);
}

// Save local development accounts
async function saveUsers(users) {
  await fs.writeFile(
    USERS_FILE,
    JSON.stringify(users, null, 2),
    "utf8"
  );
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

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Kumarites API running at http://localhost:${PORT}`);
});