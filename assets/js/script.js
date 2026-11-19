/* ==========================================================
   Stylex - script.js
   One file used by every page. Each page has <body data-page="...">
   so we know which part of the code to run.
   ========================================================== */

// ---------- 1. SAMPLE PRODUCT DATA ----------
// Images come from Unsplash. If one fails, FALLBACK_IMG is shown instead.
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="#E9E2D0"/><text x="50%" y="50%" fill="#1E3B2F" font-family="Arial" font-size="32" text-anchor="middle">Stylex</text></svg>');

const CATEGORIES = ["All", "T-Shirts", "Hoodies", "Pants", "Jackets", "Accessories"];

const PRODUCTS = [
  { id: 1,  name: "Classic White Tee",   price: 499,  category: "T-Shirts",    desc: "Soft cotton crew neck for everyday wear.",     image: IMG("photo-1521572163474-6864f9cf17ab"), featured: true },
  { id: 2,  name: "Black Essential Tee", price: 549,  category: "T-Shirts",    desc: "Relaxed fit tee that goes with anything.",     image: IMG("photo-1583743814966-8936f5b7be1a") },
  { id: 3,  name: "Sage Pocket Tee",     price: 599,  category: "T-Shirts",    desc: "Lightweight tee with a small chest pocket.",   image: IMG("photo-1576871337632-b9aef4c17ab9") },
  { id: 4,  name: "Forest Pullover Hoodie", price: 1499, category: "Hoodies",  desc: "Warm fleece hoodie with a roomy front pocket.", image: IMG("photo-1556821840-3a63f95609a7"), featured: true },
  { id: 5,  name: "Oversized Grey Hoodie",  price: 1599, category: "Hoodies",  desc: "Oversized cut, brushed inside for comfort.",    image: IMG("photo-1620799140408-edc6dcb6d633") },
  { id: 6,  name: "Slim Blue Jeans",     price: 1299, category: "Pants",       desc: "Stretch denim with a clean slim fit.",         image: IMG("photo-1542272604-787c3835535d"), featured: true },
  { id: 7,  name: "Beige Chino Pants",   price: 1199, category: "Pants",       desc: "Smart casual chinos for school or weekends.",  image: IMG("photo-1624378515195-6bbdb73dff1a") },
  { id: 8,  name: "Relaxed Cargo Pants", price: 1399, category: "Pants",       desc: "Roomy pockets and a comfortable straight leg.", image: IMG("photo-1594938298603-c8148c4dae35") },
  { id: 9,  name: "Olive Bomber Jacket", price: 2299, category: "Jackets",     desc: "Light bomber jacket with a zip front.",        image: IMG("photo-1551028719-00167b16eac5"), featured: true },
  { id: 10, name: "Classic Denim Jacket", price: 1999, category: "Jackets",    desc: "A timeless denim layer for cool evenings.",    image: IMG("photo-1591047139829-d91aecb6caea") },
  { id: 11, name: "Everyday Backpack",   price: 1099, category: "Accessories", desc: "Roomy backpack with a padded laptop pocket.",  image: IMG("photo-1553062407-98eeb64c6a62") },
  { id: 12, name: "Round Sunglasses",    price: 699,  category: "Accessories", desc: "UV-protected lenses with a light frame.",      image: IMG("photo-1572635196237-14b3f281503f") }
];

// ---------- 2. SMALL HELPERS ----------
const peso = n => "₱" + n.toLocaleString("en-PH");
const findProduct = id => PRODUCTS.find(p => p.id === id);
const root = () => document.body.dataset.root || ""; // "" on index.html, "../" inside /pages

// Show a short message (Bootstrap toast) after every action
function showToast(message) {
  const area = document.getElementById("toastArea");
  const el = document.createElement("div");
  el.className = "toast align-items-center text-bg-dark border-0";
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  area.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 2500 });
  toast.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

// ---------- 3. CART (saved in localStorage) ----------
// The cart is an array like [{ id: 1, qty: 2 }, ...]
function getCart() {
  try { return JSON.parse(localStorage.getItem("stylexCart")) || []; }
  catch (e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem("stylexCart", JSON.stringify(cart));
  updateCartBadge();
}
const cartCount = () => getCart().reduce((sum, item) => sum + item.qty, 0);
const cartTotal = () => getCart().reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty++; else cart.push({ id, qty: 1 });
  saveCart(cart);
  showToast(`${findProduct(id).name} added to cart.`);
}
function changeQty(id, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + change); // quantity never goes below 1
  saveCart(cart);
  showToast(`Quantity updated: ${item.qty} × ${findProduct(id).name}.`);
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  showToast(`${findProduct(id).name} removed from cart.`);
}
function updateCartBadge() {
  document.querySelectorAll(".cart-badge").forEach(b => b.textContent = cartCount());
}

// ---------- 4. SHARED NAVBAR + FOOTER ----------
function renderLayout() {
  const r = root(), page = document.body.dataset.page;
  const links = [["home", r + "index.html", "Home"], ["shop", r + "pages/shop.html", "Shop"],
                 ["cart", r + "pages/cart.html", "Cart"], ["checkout", r + "pages/checkout.html", "Checkout"]];
  const items = links.map(([key, href, label]) => {
    const badge = key === "cart" ? ` <span class="cart-badge" aria-label="items in cart">0</span>` : "";
    return `<li class="nav-item"><a class="nav-link ${page === key ? "active" : ""}" ${page === key ? 'aria-current="page"' : ""} href="${href}">${label}${badge}</a></li>`;
  }).join("");

  document.getElementById("site-header").innerHTML = `
    <nav class="navbar navbar-expand-md site-nav" aria-label="Main navigation"><div class="container">
      <a class="brand" href="${r}index.html">Stylex</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav ms-auto">${items}</ul></div>
    </div></nav>`;

  document.getElementById("site-footer").innerHTML = `
    <footer class="site-footer"><div class="container"><div class="row g-4">
      <div class="col-md-5"><h2>Stylex</h2><p>Simple, comfortable clothing for students and young adults. This is a school demo store: no real orders are made.</p></div>
      <div class="col-md-3"><h2>Contact</h2><p class="mb-1">Email: <a href="mailto:hello@stylex.example">hello@stylex.example</a></p><p class="mb-1">Phone: 0912 345 6789</p><p>Zambales, Philippines</p></div>
      <div class="col-md-4"><h2>Store hours</h2><p class="mb-1">Monday to Saturday</p><p>9:00 AM to 6:00 PM</p></div>
    </div><p class="small mt-3 mb-0">© 2026 Stylex. School laboratory project.</p></div></footer>
    <div id="toastArea" class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite"></div>`;
  updateCartBadge();
}

// ---------- 5. PRODUCT CARD (reused on Home and Shop) ----------
function productCard(p) {
  return `<div class="col-6 col-md-4 col-lg-3"><article class="card product-card h-100">
    <img src="${p.image}" class="product-img" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK_IMG">
    <div class="card-body d-flex flex-column">
      <span class="product-cat">${p.category}</span>
      <h3 class="h6 mt-1">${p.name}</h3>
      <p class="small text-soft flex-grow-1">${p.desc}</p>
      <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
        <strong>${peso(p.price)}</strong>
        <button class="btn btn-stylex btn-sm" data-add="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button>
      </div></div></article></div>`;
}

// ---------- 6. HOME PAGE ----------
function initHome() {
  document.getElementById("featuredGrid").innerHTML = PRODUCTS.filter(p => p.featured).map(productCard).join("");
}

// ---------- 7. SHOP PAGE: search + filter + sort ----------
const shopState = { search: "", category: "All", sort: "default" };

function getVisibleProducts() {
  let list = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(shopState.search.toLowerCase().trim()) &&
    (shopState.category === "All" || p.category === shopState.category));
  if (shopState.sort === "low") list.sort((a, b) => a.price - b.price);
  if (shopState.sort === "high") list.sort((a, b) => b.price - a.price);
  if (shopState.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function renderShop() {
  const list = getVisibleProducts();
  document.getElementById("productGrid").innerHTML = list.map(productCard).join("");
  document.getElementById("noResults").classList.toggle("d-none", list.length > 0);
  document.getElementById("resultCount").textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
  document.querySelectorAll("[data-cat]").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === shopState.category);
    b.setAttribute("aria-pressed", b.dataset.cat === shopState.category);
  });
}
function initShop() {
  document.getElementById("categoryButtons").innerHTML = CATEGORIES.map(c =>
    `<button type="button" class="btn btn-outline-stylex btn-sm" data-cat="${c}">${c}</button>`).join("");
  document.getElementById("search").addEventListener("input", e => { shopState.search = e.target.value; renderShop(); });
  document.getElementById("sort").addEventListener("change", e => { shopState.sort = e.target.value; renderShop(); });
  document.getElementById("categoryButtons").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]");
    if (b) { shopState.category = b.dataset.cat; renderShop(); }
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    shopState.search = ""; shopState.category = "All"; shopState.sort = "default";
    document.getElementById("search").value = ""; document.getElementById("sort").value = "default";
    renderShop(); showToast("Filters cleared.");
  });
  renderShop();
}

// ---------- 8. CART PAGE ----------
function renderCart() {
  const cart = getCart(), box = document.getElementById("cartItems");
  document.getElementById("cartEmpty").classList.toggle("d-none", cart.length > 0);
  document.getElementById("cartContent").classList.toggle("d-none", cart.length === 0);
  box.innerHTML = cart.map(item => {
    const p = findProduct(item.id);
    return `<div class="cart-row d-flex flex-wrap gap-3 align-items-center">
      <img class="cart-thumb" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
      <div class="flex-grow-1"><h3 class="h6 mb-1">${p.name}</h3><div class="small text-soft">${peso(p.price)} each</div>
        <button class="btn btn-link text-danger p-0 mt-1" data-action="remove" data-id="${p.id}" aria-label="Remove ${p.name}">Remove</button></div>
      <div class="qty-box" role="group" aria-label="Quantity for ${p.name}">
        <button class="btn btn-outline-stylex btn-sm" data-action="dec" data-id="${p.id}" aria-label="Decrease quantity" ${item.qty === 1 ? "disabled" : ""}>−</button>
        <span class="fw-bold" aria-live="polite">${item.qty}</span>
        <button class="btn btn-outline-stylex btn-sm" data-action="inc" data-id="${p.id}" aria-label="Increase quantity">+</button></div>
      <div class="fw-bold text-end" style="min-width:6rem">${peso(p.price * item.qty)}</div></div>`;
  }).join("");
  document.getElementById("totalQty").textContent = cartCount();
  document.getElementById("totalPrice").textContent = peso(cartTotal());
}

// ---------- 9. CHECKOUT PAGE ----------
// Each rule returns "" when valid, or an error message when invalid.
const rules = {
  fullName: v => v.trim().length >= 3 ? "" : "Enter your full name (at least 3 letters).",
  email: v => !v.trim() ? "Email address is required."
    : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com.",
  phone: v => !v.trim() ? "Phone number is required."
    : /^(09|\+639)\d{9}$/.test(v.replace(/[\s-]/g, "")) ? "" : "Enter a valid PH mobile number, like 09123456789.",
  address: v => v.trim().length >= 10 ? "" : "Enter your full delivery address (at least 10 characters)."
};
function validateField(input) {
  const msg = rules[input.name](input.value);
  input.classList.toggle("is-invalid", msg !== "");
  input.classList.toggle("is-valid", msg === "");
  input.nextElementSibling.textContent = msg;
  return msg === "";
}
function validateCheckout(form) {
  let ok = true;
  Object.keys(rules).forEach(name => { if (!validateField(form.elements[name])) ok = false; });
  const paymentOk = !!form.querySelector('input[name="payment"]:checked');
  document.getElementById("paymentError").classList.toggle("d-none", paymentOk);
  return ok && paymentOk;
}
function initCheckout() {
  const cart = getCart(), form = document.getElementById("checkoutForm");
  if (cart.length === 0) {
    document.getElementById("checkoutEmpty").classList.remove("d-none");
    document.getElementById("checkoutContent").classList.add("d-none");
    return;
  }
  document.getElementById("orderSummary").innerHTML = cart.map(i => {
    const p = findProduct(i.id);
    return `<li class="d-flex justify-content-between py-1"><span>${p.name} × ${i.qty}</span><span>${peso(p.price * i.qty)}</span></li>`;
  }).join("");
  document.getElementById("summaryTotal").textContent = peso(cartTotal());

  Object.keys(rules).forEach(n => form.elements[n].addEventListener("blur", e => validateField(e.target)));
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateCheckout(form)) { showToast("Please fix the errors in the form."); return; }
    const orderNo = "STX-" + Date.now().toString().slice(-6);
    localStorage.removeItem("stylexCart"); // clear the cart after a successful demo order
    updateCartBadge();
    document.getElementById("checkoutContent").classList.add("d-none");
    document.getElementById("successMsg").classList.remove("d-none");
    document.getElementById("orderNo").textContent = orderNo;
    showToast("Demo order placed.");
    window.scrollTo(0, 0);
  });
}

// ---------- 10. START THE RIGHT CODE FOR EACH PAGE ----------
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(Number(add.dataset.add)); return; }
  const act = e.target.closest("[data-action]");
  if (act) {
    const id = Number(act.dataset.id);
    if (act.dataset.action === "inc") changeQty(id, 1);
    if (act.dataset.action === "dec") changeQty(id, -1);
    if (act.dataset.action === "remove") removeFromCart(id);
    renderCart();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "shop") initShop();
  if (page === "cart") renderCart();
  if (page === "checkout") initCheckout();
});
