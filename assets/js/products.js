(function initProductsPage() {
  const Nova = window.NovaApp;
  if (!Nova) {
    console.error('Nova Shop: app.js must load before products.js');
    return;
  }

  const { apiFetch, formatMoney, escapeHtml, openModal, closeModal } = Nova;

  let categoryList = [];
  let supplierList = [];
  let productList = [];

  async function loadLookups() {
    const [catRes, supRes] = await Promise.all([
      apiFetch('categories.php'),
      apiFetch('suppliers.php'),
    ]);
    categoryList = catRes.data.data || [];
    supplierList = supRes.data.data || [];
  }

  function categoryOptions(selectedId) {
    if (!categoryList.length) {
      return '<option value="">No categories — add one first</option>';
    }
    return categoryList
      .map((c) => `<option value="${c.id}" ${c.id == selectedId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
      .join('');
  }

  function supplierOptions(selectedId) {
    const opts = '<option value="">— None —</option>';
    return (
      opts +
      supplierList
        .map((s) => `<option value="${s.id}" ${s.id == selectedId ? 'selected' : ''}>${escapeHtml(s.name)}</option>`)
        .join('')
    );
  }

  function productFormHtml(product) {
    const p = product || {};
    const unitPrice = p.unit_price != null && p.unit_price !== '' ? p.unit_price : '';
    const quantity = p.quantity != null && p.quantity !== '' ? p.quantity : 0;
    const minStock = p.min_stock_level != null && p.min_stock_level !== '' ? p.min_stock_level : 10;

    return `
    <form id="productForm">
      <div class="form-group">
        <label>Name *</label>
        <input name="name" required value="${escapeHtml(p.name || '')}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>SKU *</label>
          <input name="sku" required value="${escapeHtml(p.sku || '')}">
        </div>
        <div class="form-group">
          <label>Unit Price *</label>
          <input name="unit_price" type="number" step="0.01" min="0" required value="${unitPrice}">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${escapeHtml(p.description || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category *</label>
          <select name="category_id" required>${categoryOptions(p.category_id)}</select>
        </div>
        <div class="form-group">
          <label>Supplier</label>
          <select name="supplier_id">${supplierOptions(p.supplier_id)}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Quantity *</label>
          <input name="quantity" type="number" min="0" required value="${quantity}">
        </div>
        <div class="form-group">
          <label>Min Stock Level</label>
          <input name="min_stock_level" type="number" min="0" value="${minStock}">
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="NovaApp.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${product ? 'Update' : 'Create'}</button>
      </div>
    </form>`;
  }

  async function renderProducts() {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    const { data } = await apiFetch('products.php');
    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty">${escapeHtml(data.message)}</td></tr>`;
      return;
    }

    productList = data.data;
    if (!productList.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty">No products yet</td></tr>';
      return;
    }

    tbody.innerHTML = productList
      .map((p) => {
        const low = p.quantity <= p.min_stock_level;
        return `<tr>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.sku)}</td>
        <td>${escapeHtml(p.category_name)}</td>
        <td>${escapeHtml(p.supplier_name || '—')}</td>
        <td><span class="badge ${low ? 'badge-low' : 'badge-ok'}">${p.quantity}</span></td>
        <td>${p.min_stock_level}</td>
        <td>${formatMoney(p.unit_price)}</td>
        <td class="actions-cell">
          <button type="button" class="btn btn-edit" data-edit="${p.id}">Edit</button>
          <button type="button" class="btn btn-danger" data-del="${p.id}">Delete</button>
        </td>
      </tr>`;
      })
      .join('');

    tbody.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => editProduct(btn.dataset.edit));
    });
    tbody.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.del));
    });
  }

  function bindProductForm(id) {
    const form = document.getElementById('productForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const body = Object.fromEntries(fd);
      body.category_id = parseInt(body.category_id, 10);
      body.supplier_id = body.supplier_id ? parseInt(body.supplier_id, 10) : null;
      body.quantity = parseInt(body.quantity, 10);
      body.min_stock_level = parseInt(body.min_stock_level, 10);
      body.unit_price = parseFloat(body.unit_price);

      const path = id ? `products.php?id=${id}` : 'products.php';
      const { data } = await apiFetch(path, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      });

      if (data.success) {
        closeModal();
        renderProducts();
      } else {
        alert(data.message || 'Could not save product.');
      }
    });
  }

  async function editProduct(id) {
    const product = productList.find((p) => p.id == id);
    openModal('Edit Product', productFormHtml(product));
    bindProductForm(id);
  }

  async function deleteProduct(id) {
    const p = productList.find((x) => x.id == id);
    const name = p && p.name ? p.name : 'this product';
    if (!confirm(`Delete "${name}"?`)) return;
    const { data } = await apiFetch(`products.php?id=${id}`, { method: 'DELETE' });
    if (data.success) renderProducts();
    else alert(data.message);
  }

  async function openAddProductModal() {
    try {
      await loadLookups();
      if (!categoryList.length) {
        alert('Add at least one category before creating a product (Categories page).');
        return;
      }
      openModal('Add Product', productFormHtml());
      bindProductForm();
    } catch (err) {
      console.error(err);
      alert('Could not open the product form. Refresh the page and try again.');
    }
  }

  function bindPageActions() {
    const addBtn = document.getElementById('btnAddProduct');
    if (!addBtn) {
      console.error('Nova Shop: #btnAddProduct not found on this page.');
      return;
    }
    addBtn.addEventListener('click', openAddProductModal);
  }

  async function boot() {
    try {
      bindPageActions();
      await loadLookups();
      await renderProducts();
    } catch (err) {
      console.error(err);
      const tbody = document.querySelector('#productsTable tbody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty">Failed to load products. Refresh the page.</td></tr>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
