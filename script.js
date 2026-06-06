
document.addEventListener("DOMContentLoaded", function () {
  const CART_KEY = "fitlifeShoppingCart";
  const NEWSLETTER_KEY = "fitlifeNewsletterEmail";
  const FEEDBACK_KEY = "fitlifeCustomerFeedback";
  const CUSTOM_ORDER_KEY = "fitlifeCustomOrders";

  function readJSON(storage, key, fallback) {
    try { return JSON.parse(storage.getItem(key)) || fallback; }
    catch (error) { return fallback; }
  }

  function getCart() { return readJSON(sessionStorage, CART_KEY, []); }
  function saveCart(cart) { sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function money(value) { return "$" + Number(value || 0).toFixed(2); }



  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      siteNav.classList.toggle("open");
      const isOpen = siteNav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    if (!cartItems || !cartTotal) return;
    const cart = getCart();
    cartItems.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Your cart is currently empty.";
      cartItems.appendChild(empty);
      cartTotal.textContent = "Total: $0.00";
      return;
    }
    cart.forEach(function (item) {
      total += Number(item.price || 0);
      const li = document.createElement("li");
      li.textContent = item.name + " - " + money(item.price);
      cartItems.appendChild(li);
    });
    cartTotal.textContent = "Total: " + money(total);
  }

  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      const item = { name: button.dataset.name || "FitLife item", price: Number(button.dataset.price || 0), addedAt: new Date().toISOString() };
      const cart = getCart();
      cart.push(item);
      saveCart(cart);
      alert("Item added.");
      renderCart();
    });
  });

  const viewCartBtn = document.getElementById("viewCartBtn");
  if (viewCartBtn) viewCartBtn.addEventListener("click", function () { renderCart(); const modal = document.getElementById("cartModal"); if (modal) modal.hidden = false; });
  const closeCartBtn = document.getElementById("closeCartBtn");
  if (closeCartBtn) closeCartBtn.addEventListener("click", function () { document.getElementById("cartModal").hidden = true; });
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) clearCartBtn.addEventListener("click", function () { sessionStorage.removeItem(CART_KEY); renderCart(); });
  const processOrderBtn = document.getElementById("processOrderBtn");
  if (processOrderBtn) processOrderBtn.addEventListener("click", function () { alert("Thank you for your order."); sessionStorage.removeItem(CART_KEY); renderCart(); document.getElementById("cartModal").hidden = true; });
  const cartModal = document.getElementById("cartModal");
  if (cartModal) cartModal.addEventListener("click", function (event) { if (event.target === cartModal) cartModal.hidden = true; });
  document.addEventListener("keydown", function (event) { const modal = document.getElementById("cartModal"); if (event.key === "Escape" && modal) modal.hidden = true; });

  document.querySelectorAll("form").forEach(function (form) {
    const identity = (form.id + " " + form.className + " " + form.textContent).toLowerCase();
    if (identity.includes("subscribe") || identity.includes("newsletter")) {
      form.addEventListener("submit", function (event) {
        const email = form.querySelector("input[type='email']");
        if (email && email.value.trim()) { localStorage.setItem(NEWSLETTER_KEY, email.value.trim()); alert("Thank you for subscribing."); }
      });
    }
    if (form.id === "feedbackForm" || identity.includes("feedback") || identity.includes("custom order")) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const type = data.get("type") || "Customer Feedback";
        const record = { name: data.get("name") || "", email: data.get("email") || "", type: type, message: data.get("message") || "", submittedAt: new Date().toISOString() };
        const storageKey = type.toLowerCase().includes("custom") ? CUSTOM_ORDER_KEY : FEEDBACK_KEY;
        const saved = readJSON(localStorage, storageKey, []);
        saved.push(record);
        localStorage.setItem(storageKey, JSON.stringify(saved));
        const status = document.getElementById("feedbackStatus");
        if (status) status.textContent = "Thank you. Your " + type.toLowerCase() + " was saved in localStorage.";
        else alert("Thank you. Your request was saved in localStorage.");
        form.reset();
      });
    }
  });
  renderCart();
});
