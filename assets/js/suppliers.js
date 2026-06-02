(function initSuppliersPage() {
  const Nova = window.NovaApp;
  if (!Nova) {
    console.error('Nova Shop: app.js must load before suppliers.js');
    return;
  }

  const { apiFetch, escapeHtml, openModal, closeModal } = Nova;
  let supplierList = [];

  function supplierFormHtml(supplier) {
    const row = supplier || {};
    return `
    <form id="supplierForm">
      <div class="form-group">
        <label>Name *</label>
        <input name="name" required value="${escapeHtml(row.name || '')}">
      </div>
      <div class="form-group">
        <label>Contact Person</label>
        <input name="contact_person" value="${escapeHtml(row.contact_person || '')}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${escapeHtml(row.email || '')}">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input name="phone" value="${escapeHtml(row.phone || '')}">
        </div>
      </div>
      <div class="form-group">
        <label>Address</label>
        <textarea name="address">${escapeHtml(row.address || '')}</textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick="NovaApp.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${supplier ? 'Update' : 'Create'}</button>
      </div>
    </form>`;
  }

  async function renderSuppliers() {
    const tbody = document.querySelector('#suppliersTable tbody');
    if (!tbody) return;

    const { data } = await apiFetch('suppliers.php');
    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(data.message)}</td></tr>`;
      return;
    }

    supplierList = data.data || [];
    if (!supplierList.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No suppliers yet</td></tr>';
      return;
    }

    tbody.innerHTML = supplierList
      .map(
        (s) => `<tr>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.contact_person || '—')}</td>
        <td>${escapeHtml(s.email || '—')}</td>
        <td>${escapeHtml(s.phone || '—')}</td>
        <td>${s.product_count}</td>
        <td class="actions-cell">
          <button type="button" class="btn btn-edit" data-edit="${s.id}">Edit</button>
          <button type="button" class="btn btn-danger" data-del="${s.id}">Delete</button>
        </td>
      </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = supplierList.find((x) => x.id == btn.dataset.edit);
        openModal('Edit Supplier', supplierFormHtml(s));
        bindForm(s.id);
      });
    });
    tbody.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => deleteSupplier(btn.dataset.del));
    });
  }

  function bindForm(id) {
    const form = document.getElementById('supplierForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = Object.fromEntries(new FormData(form));
      const path = id ? `suppliers.php?id=${id}` : 'suppliers.php';
      const { data } = await apiFetch(path, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      });
      if (data.success) {
        closeModal();
        renderSuppliers();
      } else {
        alert(data.message || 'Could not save supplier.');
      }
    });
  }

  async function deleteSupplier(id) {
    const s = supplierList.find((x) => x.id == id);
    const name = s && s.name ? s.name : 'this supplier';
    if (!confirm(`Delete supplier "${name}"?`)) return;
    const { data } = await apiFetch(`suppliers.php?id=${id}`, { method: 'DELETE' });
    if (data.success) renderSuppliers();
    else alert(data.message);
  }

  function bindPageActions() {
    document.getElementById('btnAddSupplier')?.addEventListener('click', () => {
      openModal('Add Supplier', supplierFormHtml());
      bindForm();
    });
  }

  async function boot() {
    try {
      bindPageActions();
      await renderSuppliers();
    } catch (err) {
      console.error(err);
      const tbody = document.querySelector('#suppliersTable tbody');
      if (tbody) {
        tbody.innerHTML =
          '<tr><td colspan="6" class="empty">Failed to load suppliers. Refresh the page.</td></tr>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
