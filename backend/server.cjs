
const express = require("express");

const app = express();
const PORT = 3001;

const categories = [
  {
    id: "grocery",
    name: "Grocery"
  },
  {
    id: "food",
    name: "Food & Beverages"
  },
  {
    id: "fashion",
    name: "Fashion"
  },
  {
    id: "electronics",
    name: "Electronics"
  },
  {
    id: "school-supplies",
    name: "School Supplies"
  },
  {
    id: "home-living",
    name: "Home & Living"
  },
  {
    id: "services",
    name: "Services"
  }
];

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "kumarites-categories-api"
  });
});

app.get("/api/categories", (req, res) => {
  res.json({
    count: categories.length,
    categories: categories
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Kumarites API running at http://localhost:${PORT}`
  );
});
