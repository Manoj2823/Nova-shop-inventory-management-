/**
 * Shared app utilities — API, modal, sidebar
 */

const API = (path) => `${window.APP_BASE || ''}/api/${path}`;

async function apiFetch(path, options = {}) {
  const defaults = {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };
  const res = await fetch(API(path), { ...defaults, ...options });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = `${window.APP_BASE || ''}/auth/login.php`;
    throw new Error('Unauthorized');
  }
  return { ok: res.ok, status: res.status, data };
}

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n));
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/* Modal */
function getModalElements() {
  return {
    overlay: document.getElementById('modalOverlay'),
    title: document.getElementById('modalTitle'),
    body: document.getElementById('modalBody'),
    close: document.getElementById('modalClose'),
  };
}

function openModal(title, html) {
  const { overlay, title: titleEl, body } = getModalElements();
  if (!overlay || !titleEl || !body) {
    console.error('Nova Shop: modal markup is missing from the page.');
    return;
  }
  titleEl.textContent = title;
  body.innerHTML = html;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const { overlay, body } = getModalElements();
  if (!overlay || !body) return;
  overlay.hidden = true;
  body.innerHTML = '';
  document.body.style.overflow = '';
}

(function bindModalUi() {
  const { overlay, close } = getModalElements();
  close?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
})();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* Mobile sidebar */
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

/* 3D tilt on stat cards */
document.querySelectorAll('.stat-card.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

window.NovaApp = { apiFetch, API, formatMoney, formatDate, escapeHtml, openModal, closeModal };
