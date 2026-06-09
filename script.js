const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-question");
const CART_KEY = "coolora-cart-v1";
const PRODUCT_CATALOG = {
  "air-luxe": {
    name: "COOLORA Air Luxe",
    price: 80,
    image: "assets/images/product-air-luxe-cutout.webp",
  },
  "pro-360": {
    name: "COOLORA Pro 360",
    price: 149,
    image: "assets/images/product-pro-360-cutout.webp",
  },
};
const PRODUCT_COLORS = ["Blanc", "Bleu foncé", "Noir"];

const REVIEWS_KEY = "coolora-reviews-v1";
const REVIEW_PRODUCTS = new Set(["air-luxe", "pro-360"]);

const readReviews = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
};

const writeReviews = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const normalizeReview = (review) => {
  const name = String(review?.name || "").trim().slice(0, 40);
  const comment = String(review?.comment || "").trim().slice(0, 800);
  const rating = Number(review?.rating);
  if (!name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return { name, comment, rating };
};

const renderGuestReviews = () => {
  const reviews = readReviews();
  document.querySelectorAll("[data-guest-reviews]").forEach((container) => {
    const product = container.closest("[data-review-product]")?.dataset.reviewProduct;
    const entries = REVIEW_PRODUCTS.has(product) && Array.isArray(reviews[product])
      ? reviews[product].map(normalizeReview).filter(Boolean)
      : [];
    container.innerHTML = entries.map((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      return `<article class="customer-review customer-review-guest">
        <div class="review-topline"><div class="stars" aria-label="${review.rating} étoile${review.rating > 1 ? "s" : ""} sur 5">${stars}</div><span>Avis invité</span></div>
        <p>« ${escapeHtml(review.comment)} »</p><strong>${escapeHtml(review.name)}</strong>
      </article>`;
    }).join("");
  });
};

const submitGuestReview = (form) => {
  const product = form.dataset.reviewProduct;
  const status = form.querySelector("[data-review-status]");
  if (!REVIEW_PRODUCTS.has(product)) return;
  const review = normalizeReview({
    name: form.elements["review-name"]?.value,
    rating: form.elements["review-rating"]?.value,
    comment: form.elements["review-comment"]?.value,
  });
  if (!review) {
    if (status) status.textContent = "Merci de renseigner votre nom, une note et votre commentaire.";
    return;
  }
  const reviews = readReviews();
  const current = Array.isArray(reviews[product]) ? reviews[product] : [];
  reviews[product] = [...current.map(normalizeReview).filter(Boolean), review].slice(-30);
  writeReviews(reviews);
  form.reset();
  if (status) status.textContent = "Merci, votre avis a bien été publié.";
  renderGuestReviews();
};

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.flatMap((item) => {
      const product = PRODUCT_CATALOG[item?.id];
      if (!product) return [];
      return [{
        id: item.id,
        ...product,
        color: PRODUCT_COLORS.includes(item.color) ? item.color : "Blanc",
        quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
      }];
    });
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
  const productData = PRODUCT_CATALOG[form.dataset.productId];
  if (!productData) return;
  const product = {
    id: form.dataset.productId,
    ...productData,
    color: PRODUCT_COLORS.includes(color) ? color : "Blanc",
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


document.querySelectorAll("[data-review-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitGuestReview(form);
  });
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
renderGuestReviews();
