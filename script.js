const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-question");
const CART_KEY = "coolora-cart-v1";

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount(cart);
};

const formatPrice = (amount) => `${Number(amount).toLocaleString("fr-FR")} €`;

const updateCartCount = (cart = readCart()) => {
  const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
    badge.dataset.empty = String(count === 0);
    badge.setAttribute("aria-label", `${count} article${count > 1 ? "s" : ""} dans le panier`);
  });
};

const addProductToCart = (form, redirect = false) => {
  const color = form.querySelector('input[name="color"]:checked')?.value || "Blanc";
  const quantityInput = form.querySelector("[data-product-quantity]");
  const quantity = Math.max(1, Math.min(10, Number(quantityInput?.value) || 1));
  const product = {
    id: form.dataset.productId,
    name: form.dataset.productName,
    price: Number(form.dataset.productPrice),
    image: form.dataset.productImage,
    color,
    quantity,
  };
  const cart = readCart();
  const existing = cart.find((item) => item.id === product.id && item.color === product.color);
  if (existing) existing.quantity = Math.min(10, Number(existing.quantity) + quantity);
  else cart.push(product);
  writeCart(cart);
  const status = form.querySelector("[data-cart-status]");
  if (status) status.textContent = `${quantity} × ${product.name} (${color}) ajouté${quantity > 1 ? "s" : ""} au panier.`;
  if (redirect) window.location.href = "panier.html";
};

const renderCart = () => {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  const cart = readCart();
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Votre panier est vide pour le moment.</p>';
  } else {
    container.innerHTML = cart.map((item, index) => `
      <article class="cart-item">
        <a class="cart-item-image" href="product-${item.id}.html" aria-label="Voir ${item.name}"><img src="${item.image}" alt="${item.name}" /></a>
        <div><h2>${item.name}</h2><p class="cart-item-meta">Couleur : ${item.color} · ${formatPrice(item.price)}</p>
          <div class="cart-item-controls"><label>Quantité <input type="number" min="1" max="10" value="${item.quantity}" data-cart-quantity="${index}" aria-label="Quantité pour ${item.name}" /></label><button class="remove-item" type="button" data-remove-item="${index}">Supprimer</button></div>
        </div><strong class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</strong>
      </article>`).join("");
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelectorAll("[data-cart-subtotal], [data-cart-total]").forEach((node) => { node.textContent = formatPrice(total); });
  const checkoutLink = document.querySelector("[data-checkout-link]");
  if (checkoutLink) {
    checkoutLink.classList.toggle("is-disabled", !cart.length);
    checkoutLink.setAttribute("aria-disabled", String(!cart.length));
  }
};

const renderCheckout = () => {
  const container = document.querySelector("[data-checkout-items]");
  if (!container) return;
  const cart = readCart();
  if (!cart.length) container.innerHTML = "<p>Votre panier est vide pour le moment.</p>";
  else container.innerHTML = cart.map((item) => `<div class="checkout-summary-item"><img src="${item.image}" alt="" /><span><strong>${item.name}</strong><small>${item.color} · Qté ${item.quantity}</small></span><strong>${formatPrice(item.price * item.quantity)}</strong></div>`).join("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalNode = document.querySelector("[data-checkout-total]");
  if (totalNode) totalNode.textContent = formatPrice(total);
};

if (window.location.hash) revealItems.forEach((item) => item.classList.add("is-visible"));

const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}));

faqButtons.forEach((button) => button.addEventListener("click", () => {
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isExpanded));
}));

document.querySelectorAll("[data-product-form]").forEach((form) => {
  form.querySelector("[data-add-to-cart]")?.addEventListener("click", () => addProductToCart(form));
  form.querySelector("[data-buy-now]")?.addEventListener("click", () => addProductToCart(form, true));
});

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-cart-quantity]");
  if (!input) return;
  const cart = readCart();
  const index = Number(input.dataset.cartQuantity);
  if (!cart[index]) return;
  cart[index].quantity = Math.max(1, Math.min(10, Number(input.value) || 1));
  writeCart(cart);
  renderCart();
});

document.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");
  if (removeButton) {
    const cart = readCart();
    cart.splice(Number(removeButton.dataset.removeItem), 1);
    writeCart(cart);
    renderCart();
  }
  const disabledSocial = event.target.closest(".social-links .is-disabled");
  if (disabledSocial) event.preventDefault();
});

document.querySelectorAll("[data-placeholder-form]").forEach((form) => form.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = form.querySelector("[data-form-status]");
  if (status) status.textContent = form.dataset.formMessage || "Ce formulaire n’est pas encore connecté.";
}));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  revealItems.forEach((item, index) => { item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`; observer.observe(item); });
  const revealVisibleItems = () => revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) item.classList.add("is-visible");
  });
  window.addEventListener("load", () => { requestAnimationFrame(revealVisibleItems); window.setTimeout(revealVisibleItems, 250); });
} else revealItems.forEach((item) => item.classList.add("is-visible"));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
});

updateCartCount();
renderCart();
renderCheckout();
