(function initCategoriesPage() {
  const Nova = window.NovaApp;
  if (!Nova) {
    console.error('Nova Shop: app.js must load before categories.js');
    return;
  }

  const { apiFetch, escapeHtml, openModal, closeModal } = Nova;
  let categoryList = [];

  function categoryFormHtml(cat) {
    const c = cat || {};
    return `
    <form id="categoryForm">
      <div class="form-group">
        <label>Name *</label>
        <input name="name" required value="${escapeHtml(c.name || '')}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${escapeHtml(c.description || '')}</textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="NovaApp.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${cat ? 'Update' : 'Create'}</button>
      </div>
    </form>`;
  }

  async function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    const { data } = await apiFetch('categories.php');
    if (!data.success) {
      grid.innerHTML = `<p class="empty">${escapeHtml(data.message)}</p>`;
      return;
    }

    categoryList = data.data;
    if (!categoryList.length) {
      grid.innerHTML = '<p class="empty">No categories yet</p>';
      return;
    }

    grid.innerHTML = categoryList
      .map(
        (c) => `
      <article class="category-card card-3d tilt">
        <h3>${escapeHtml(c.name)}</h3>
        <p>${escapeHtml(c.description || 'No description')}</p>
        <p class="meta">${c.product_count} linked product(s)</p>
        <div class="actions">
          <button type="button" class="btn btn-edit" data-edit="${c.id}">Edit</button>
          <button type="button" class="btn btn-danger" data-del="${c.id}">Delete</button>
        </div>
      </article>`
      )
      .join('');

    grid.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = categoryList.find((x) => x.id == btn.dataset.edit);
        openModal('Edit Category', categoryFormHtml(cat));
        bindForm(cat.id);
      });
    });

    grid.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => deleteCategory(btn.dataset.del));
    });

    grid.querySelectorAll('.category-card.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function bindForm(id) {
    const form = document.getElementById('categoryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = Object.fromEntries(new FormData(form));
      const path = id ? `categories.php?id=${id}` : 'categories.php';
      const { data } = await apiFetch(path, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      });
      if (data.success) {
        closeModal();
        renderCategories();
      } else alert(data.message);
    });
  }

  async function deleteCategory(id) {
    const c = categoryList.find((x) => x.id == id);
    const name = c && c.name ? c.name : 'this category';
    if (!confirm(`Delete category "${name}"?`)) return;
    const { data } = await apiFetch(`categories.php?id=${id}`, { method: 'DELETE' });
    if (data.success) renderCategories();
    else alert(data.message);
  }

  function bindPageActions() {
    document.getElementById('btnAddCategory')?.addEventListener('click', () => {
      openModal('Add Category', categoryFormHtml());
      bindForm();
    });
  }

  async function boot() {
    try {
      bindPageActions();
      await renderCategories();
    } catch (err) {
      console.error(err);
      const grid = document.getElementById('categoriesGrid');
      if (grid) {
        grid.innerHTML = '<p class="empty">Failed to load categories. Refresh the page.</p>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
