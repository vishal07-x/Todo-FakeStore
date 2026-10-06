const ProductApp = (() => {
  const API_URL = "/api/products";
  let products = [];
  let filteredProducts = [];

  const els = {};

  function init() {
    els.grid = document.querySelector("#products-grid");
    els.loading = document.querySelector("#products-loading");
    els.error = document.querySelector("#products-error");
    els.status = document.querySelector("#product-status");
    els.search = document.querySelector("#product-search");
    els.details = document.querySelector("#product-details");

    els.grid.addEventListener("click", handleProductClick);
    els.search.addEventListener("input", handleSearch);

    fetchProducts();
  }

  async function fetchProducts() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      products = await response.json();
      filteredProducts = [...products];
      renderProducts();
      els.status.textContent = `${products.length} products available`;
    } catch (error) {
      showError("Unable to load products. Please check your internet connection and try again.");
      els.status.textContent = "Failed to load products";
      console.error("Product API error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();

    filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );

    renderProducts();
  }

  function renderProducts() {
    els.grid.innerHTML = "";

    if (filteredProducts.length === 0) {
      els.grid.innerHTML = `
        <div class="empty-state card" style="grid-column: 1 / -1;">
          <h3>No products found</h3>
          <p>Try a different search term.</p>
        </div>
      `;
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.id = product.id;

      card.innerHTML = `
        <div class="product-image-wrap">
          <img class="product-image" src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.title)}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-category">${escapeHTML(product.category)}</div>
          <div class="product-title">${escapeHTML(product.title)}</div>
          <div class="product-bottom">
            <span class="price">$${Number(product.price).toFixed(2)}</span>
            <button class="primary-btn details-btn" data-product-id="${product.id}">Details</button>
          </div>
        </div>
      `;

      els.grid.appendChild(card);
    });
  }

  function handleProductClick(event) {
    const button = event.target.closest("[data-product-id]");
    const card = event.target.closest(".product-card");
    const id = Number(button?.dataset.productId || card?.dataset.id);

    if (id) showProductDetails(id);
  }

  async function showProductDetails(id) {
    els.grid.classList.add("hidden");
    document.querySelector(".store-toolbar").classList.add("hidden");
    els.details.classList.remove("hidden");
    els.details.innerHTML = `
      <button class="secondary-btn back-btn" id="back-to-products">← Back to Products</button>
      <div class="loading-state"><div><div class="spinner"></div><p>Loading product details...</p></div></div>
    `;

    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const product = await response.json();

      els.details.innerHTML = `
        <button class="secondary-btn back-btn" id="back-to-products">← Back to Products</button>
        <div class="details-layout">
          <div class="details-image">
            <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.title)}">
          </div>
          <div class="details-content">
            <div class="product-category">${escapeHTML(product.category)}</div>
            <h2>${escapeHTML(product.title)}</h2>
            <div class="details-price">$${Number(product.price).toFixed(2)}</div>
            <div class="rating">★ ${Number(product.rating?.rate || 0).toFixed(1)} · ${product.rating?.count || 0} ratings</div>
            <p class="details-description">${escapeHTML(product.description)}</p>
          </div>
        </div>
      `;

      document.querySelector("#back-to-products").addEventListener("click", hideDetails);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      els.details.innerHTML = `
        <button class="secondary-btn back-btn" id="back-to-products">← Back to Products</button>
        <div class="error-state">Unable to load this product. Please try again.</div>
      `;
      document.querySelector("#back-to-products").addEventListener("click", hideDetails);
      console.error("Product detail error:", error);
    }
  }

  function hideDetails() {
    els.details.classList.add("hidden");
    els.grid.classList.remove("hidden");
    document.querySelector(".store-toolbar").classList.remove("hidden");
  }

  function setLoading(isLoading) {
    els.loading.classList.toggle("hidden", !isLoading);
    els.grid.classList.toggle("hidden", isLoading);
    els.error.classList.add("hidden");
  }

  function showError(message) {
    els.error.textContent = message;
    els.error.classList.remove("hidden");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttribute(value) {
    return escapeHTML(value);
  }

  return { init };
})();
