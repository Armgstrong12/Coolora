const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-question");
const CART_KEY = "coolora-cart-v1";
const ALLOWED_COLORS = ["White", "Beige / Apricot", "Ice Green", "Black", "Blanc", "Bleu foncé", "Noir"];
const PRODUCTS = {
  "air-luxe": {
    name: "Coolera Cooling Neck Fan",
    price: 80,
    image: "assets/images/product-air-luxe-cutout.webp",
    page: "product-air-luxe.html",
  },
  "pro-360": {
    name: "COOLORA Pro 360",
    price: 149,
    image: "assets/images/product-pro-360-cutout.webp",
    page: "product-pro-360.html",
  },
};

const readCart = () => {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value.flatMap((item) => {
      if (!PRODUCTS[item?.id]) return [];
      return [{
        id: item.id,
        color: ALLOWED_COLORS.includes(item.color) ? item.color : "White",
        quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
      }];
    }) : [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount(cart);
};

const price = (value) => `${Number(value).toLocaleString("fr-FR")} €`;

const updateCartCount = (cart = readCart()) => {
  const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = count;
    node.setAttribute("aria-label", `${count} article${count > 1 ? "s" : ""} dans le panier`);
  });
};

const addToCart = (form) => {
  const id = form.dataset.productId;
  if (!PRODUCTS[id]) return;
  const requestedColor = form.elements.color?.value || "White";
  const color = ALLOWED_COLORS.includes(requestedColor) ? requestedColor : "White";
  const quantity = Math.max(1, Math.min(10, Number(form.elements.quantity?.value) || 1));
  const cart = readCart();
  const existing = cart.find((item) => item.id === id && item.color === color);
  if (existing) existing.quantity = Math.min(10, existing.quantity + quantity);
  else cart.push({ id, color, quantity });
  writeCart(cart);
  const status = form.querySelector("[data-cart-status]");
  if (status) status.textContent = `${quantity} × ${PRODUCTS[id].name} (${color}) ajouté${quantity > 1 ? "s" : ""} au panier.`;
};

const renderCart = () => {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  const cart = readCart();
  if (!cart.length) {
    container.innerHTML = '<div class="summer-empty-cart"><h2>Votre panier est vide.</h2><p>Découvrez Coolera et choisissez votre couleur.</p><a class="summer-button summer-button-primary" href="product-air-luxe.html">Découvrir le produit</a></div>';
  } else {
    container.innerHTML = cart.map((item, index) => {
      const product = PRODUCTS[item.id];
      return `<article class="summer-cart-item"><a href="${product.page}"><img src="${product.image}" alt="${product.name}" /></a><div><p>${item.color}</p><h2>${product.name}</h2><label>Quantité <input type="number" min="1" max="10" value="${item.quantity}" data-cart-quantity="${index}" /></label><button type="button" data-cart-remove="${index}">Supprimer</button></div><strong>${price(product.price * item.quantity)}</strong></article>`;
    }).join("");
  }
  const total = cart.reduce((sum, item) => sum + PRODUCTS[item.id].price * item.quantity, 0);
  document.querySelectorAll("[data-cart-subtotal], [data-cart-total]").forEach((node) => { node.textContent = price(total); });
  const checkoutLink = document.querySelector("[data-checkout-link]");
  if (checkoutLink) {
    checkoutLink.toggleAttribute("aria-disabled", !cart.length);
    checkoutLink.classList.toggle("is-disabled", !cart.length);
  }
};

const renderCheckout = () => {
  const container = document.querySelector("[data-checkout-items]");
  if (!container) return;
  const cart = readCart();
  container.innerHTML = cart.length ? cart.map((item) => {
    const product = PRODUCTS[item.id];
    return `<article><img src="${product.image}" alt="" /><span><strong>${product.name}</strong><small>${item.color} · Qté ${item.quantity}</small></span><b>${price(product.price * item.quantity)}</b></article>`;
  }).join("") : "<p>Votre panier est vide.</p>";
  const total = cart.reduce((sum, item) => sum + PRODUCTS[item.id].price * item.quantity, 0);
  const totalNode = document.querySelector("[data-checkout-total]");
  if (totalNode) totalNode.textContent = price(total);
};

const closeMenu = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 24), { passive: true });

faqButtons.forEach((button) => button.addEventListener("click", () => {
  const open = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!open));
  button.closest(".faq-item")?.classList.toggle("is-open", !open);
}));

document.querySelectorAll("[data-product-form]").forEach((form) => form.addEventListener("submit", (event) => {
  event.preventDefault();
  addToCart(form);
}));

document.addEventListener("change", (event) => {
  const quantityInput = event.target.closest("[data-cart-quantity]");
  if (!quantityInput) return;
  const cart = readCart();
  const index = Number(quantityInput.dataset.cartQuantity);
  if (cart[index]) cart[index].quantity = Math.max(1, Math.min(10, Number(quantityInput.value) || 1));
  writeCart(cart);
  renderCart();
});

document.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-cart-remove]");
  if (removeButton) {
    const cart = readCart();
    cart.splice(Number(removeButton.dataset.cartRemove), 1);
    writeCart(cart);
    renderCart();
  }
  const hotspot = event.target.closest("[data-hotspot]");
  if (hotspot) {
    const stage = hotspot.closest("[data-hotspot-stage]");
    stage?.querySelectorAll("[data-hotspot]").forEach((item) => {
      const active = item === hotspot;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-expanded", String(active));
    });
  }

  const swatch = event.target.closest("[data-color-preview]");
  if (swatch) {
    document.querySelectorAll("[data-color-preview]").forEach((item) => item.classList.remove("is-selected"));
    swatch.classList.add("is-selected");
    const color = swatch.dataset.colorPreview;
    const hidden = document.querySelector("[data-selected-color]");
    const colorName = document.querySelector("[data-color-name]");
    if (hidden) hidden.value = color;
    if (colorName) colorName.textContent = color;

    document.querySelectorAll("[data-color-product]").forEach((image) => {
      const fallback = image.dataset.defaultSrc || image.getAttribute("src");
      const candidate = swatch.dataset.colorSrc;
      image.classList.add("is-changing");
      const preload = new Image();
      preload.onload = () => {
        image.src = candidate;
        image.alt = `COOLORA AIR ONE en couleur ${color}`;
        requestAnimationFrame(() => image.classList.remove("is-changing"));
      };
      preload.onerror = () => {
        image.src = fallback;
        image.dataset.colorFallback = color;
        requestAnimationFrame(() => image.classList.remove("is-changing"));
      };
      preload.src = candidate;
    });
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  }), { threshold: 0.14, rootMargin: "0px 0px -8%" });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add("is-visible"));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector("[data-hero-scroll]");
const parallax = document.querySelector("[data-parallax]");
const story = document.querySelector("[data-scroll-story]");
const storySteps = [...document.querySelectorAll("[data-story-step]")];
const storyCaption = document.querySelector("[data-story-caption]");
const storyCaptions = ["Format tour de cou", "Double diffusion gauche / droite", "Seulement 250 g", "3 niveaux de puissance"];
let scrollTicking = false;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const updateScrollExperience = () => {
  scrollTicking = false;
  if (reducedMotion) return;

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(rect.height * 0.72, 1));
    hero.style.setProperty("--hero-progress", progress.toFixed(3));
    if (parallax) parallax.style.setProperty("--parallax-y", `${progress * 42}px`);
  }

  if (story && storySteps.length) {
    const rect = story.getBoundingClientRect();
    const travel = Math.max(story.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-rect.top / travel);
    const activeIndex = Math.min(storySteps.length - 1, Math.floor(progress * storySteps.length));
    story.style.setProperty("--story-progress", progress.toFixed(3));
    story.style.setProperty("--story-index", activeIndex);
    storySteps.forEach((step, index) => {
      const active = index === activeIndex;
      step.classList.toggle("is-active", active);
      step.setAttribute("aria-hidden", String(!active));
    });
    if (storyCaption) storyCaption.textContent = storyCaptions[activeIndex];
  }
};

const requestScrollUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollExperience);
};

if (!reducedMotion) {
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  requestScrollUpdate();
}

const staggerGroups = document.querySelectorAll("[data-stagger-group]");
if ("IntersectionObserver" in window && !reducedMotion) {
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-stagger-item]").forEach((item, index) => {
        item.style.setProperty("--stagger-delay", `${index * 130}ms`);
        item.classList.add("is-stagger-visible");
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  staggerGroups.forEach((group) => staggerObserver.observe(group));
} else {
  staggerGroups.forEach((group) => group.querySelectorAll("[data-stagger-item]").forEach((item) => item.classList.add("is-stagger-visible")));
}

updateCartCount();
renderCart();
renderCheckout();
