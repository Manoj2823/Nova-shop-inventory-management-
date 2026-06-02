const base = window.APP_BASE || '';

async function postAuth(action, body) {
  const res = await fetch(`${base}/api/auth.php?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  return res.json();
}

function showAlert(el, message, type = 'error') {
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(loginForm);
  const result = await postAuth('login', {
    username: fd.get('username'),
    password: fd.get('password'),
  });
  if (result.success) {
    window.location.href = result.redirect || `${base}/dashboard.php`;
  } else {
    window.location.href = `${base}/auth/login.php?error=${encodeURIComponent(result.message)}`;
  }
});

const registerForm = document.getElementById('registerForm');
const registerAlert = document.getElementById('registerAlert');

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(registerForm);
  const result = await postAuth('register', Object.fromEntries(fd));
  if (result.success) {
    showAlert(registerAlert, result.message, 'success');
    setTimeout(() => {
      window.location.href = result.redirect || `${base}/auth/login.php`;
    }, 1200);
  } else {
    showAlert(registerAlert, result.message, 'error');
  }
});
