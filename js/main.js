/**
 * Nova Shop — Modern ecommerce with 3D interactions
 */

const PRODUCTS = [
  {
    id: 1,
    name: 'Aurora Wireless Headphones',
    price: 189,
    category: 'audio',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Pulse Smartwatch Pro',
    price: 249,
    category: 'wear',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Nebula Laptop Stand',
    price: 79,
    category: 'tech',
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Echo Bluetooth Speaker',
    price: 129,
    category: 'audio',
    tag: null,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Velocity Running Shoes',
    price: 159,
    category: 'wear',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Quantum USB-C Hub',
    price: 59,
    category: 'tech',
    tag: null,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd9c19?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Lunar Mechanical Keyboard',
    price: 199,
    category: 'tech',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1511464787429-9c0e2e313a2f?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Stellar Earbuds Mini',
    price: 99,
    category: 'audio',
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
  },
];

let cart = [];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// --- Render products ---
function renderProducts(filter = 'all') {
  const grid = $('#productGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const hidden = filter !== 'all' && p.category !== filter;
    return `
      <article class="product-card reveal ${hidden ? 'hidden' : ''}" data-tilt data-id="${p.id}" data-category="${p.category}">
        <div class="product-image-wrap">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-body">
          <span class="product-category">${p.category}</span>
          <h3>${p.name}</h3>
          <div class="product-footer">
            <span class="product-price">$${p.price}</span>
            <button class="add-to-cart" data-id="${p.id}" aria-label="Add ${p.name} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  initTilt();
  initReveal();
  bindAddToCart();
}

// --- Cart ---
function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = $('#cartCount');
  if (countEl) countEl.textContent = count;

  const itemsEl = $('#cartItems');
  const totalEl = $('#cartTotal');
  if (!itemsEl || !totalEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<li class="cart-empty">Your cart is empty</li>';
    totalEl.textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  itemsEl.innerHTML = cart
    .map(
      (item) => `
    <li class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>$${item.price} × ${item.qty}</span>
      </div>
      <button class="cart-item-remove" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
    </li>
  `
    )
    .join('');

  totalEl.textContent = `$${total.toFixed(2)}`;

  $$('[data-remove]', itemsEl).forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.remove)));
  });
}

function openCart() {
  const drawer = $('#cartDrawer');
  if (drawer) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = $('#cartDrawer');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function bindAddToCart() {
  $$('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id));
    });
  });
}

// --- 3D tilt effect ---
function initTilt() {
  const maxTilt = 12;

  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * maxTilt;
      const rotateY = x * maxTilt;

      const card = el.querySelector('.stage-card') || el;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      const card = el.querySelector('.stage-card') || el;
      card.style.transform = '';
    });

    // Touch support
    el.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      const card = el.querySelector('.stage-card') || el;
      card.style.transform = `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`;
    }, { passive: true });

    el.addEventListener('touchend', () => {
      const card = el.querySelector('.stage-card') || el;
      card.style.transform = '';
    });
  });
}

// --- Scroll reveal ---
function initReveal() {
  const reveals = $$('.reveal:not(.visible)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

// --- Cursor glow ---
function initCursorGlow() {
  const glow = $('.cursor-glow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// --- Header scroll ---
function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Mobile menu ---
function initMobileMenu() {
  const toggle = $('#menuToggle');
  const links = $('#navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  $$('.nav-link', links).forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- Active nav on scroll ---
function initNavSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => observer.observe(s));
}

// --- Filters ---
function initFilters() {
  $$('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      $$('.product-card').forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) card.classList.add('visible');
      });
    });
  });
}

// --- Toast ---
function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// --- Newsletter ---
function initNewsletter() {
  const form = $('#newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    showToast(`Thanks! We'll send deals to ${input.value}`);
    form.reset();
  });
}

// --- Hero cube mouse parallax ---
function initHeroParallax() {
  const hero = $('#heroProduct');
  const stage = $('.hero-stage');
  if (!hero || !stage) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    hero.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    hero.style.transform = '';
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initCursorGlow();
  initHeader();
  initMobileMenu();
  initNavSpy();
  initFilters();
  initNewsletter();
  initHeroParallax();
  initTilt();
  initReveal();

  $('#cartBtn')?.addEventListener('click', openCart);
  $('#closeCart')?.addEventListener('click', closeCart);
  $('#cartOverlay')?.addEventListener('click', closeCart);
  $('#checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Add items to your cart first');
      return;
    }
    showToast('Checkout is a demo — thanks for exploring!');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
});
