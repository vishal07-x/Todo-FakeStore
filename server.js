const express = require("express");
const cors = require("cors");
const path = require("path");
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JavaScript Assignment API is running",
  });
});

// Get all products, with optional search
app.get("/api/products", (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();

  const result = search
    ? products.filter((product) =>
        product.title.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      )
    : products;

  res.json(result);
});

// Get one product by ID
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json(product);
});

// Serve the frontend
app.use(express.static(__dirname));

// Return index.html for normal browser routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});
