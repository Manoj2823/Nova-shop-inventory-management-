(function initDashboardPage() {
  const Nova = window.NovaApp;
  if (!Nova) {
    console.error('Nova Shop: app.js must load before dashboard.js');
    return;
  }

  const { apiFetch, formatMoney, formatDate, escapeHtml } = Nova;

  async function loadSaleProducts() {
    const select = document.getElementById('saleProduct');
    if (!select) return;

    try {
      const { data } = await apiFetch('products.php');
      if (!data.success) {
        select.innerHTML = '<option value="">Could not load products</option>';
        return;
      }

      const products = data.data || [];
      const inStock = products.filter((p) => Number(p.quantity) > 0);

      if (!inStock.length) {
        select.innerHTML =
          '<option value="">No products in stock — add stock on Products page</option>' +
          products
            .map(
              (p) =>
                `<option value="${p.id}" disabled>${escapeHtml(p.name)} (0 in stock)</option>`
            )
            .join('');
        return;
      }

      select.innerHTML =
        '<option value="">Select product…</option>' +
        inStock
          .map(
            (p) =>
              `<option value="${p.id}">${escapeHtml(p.name)} (${p.quantity} in stock — ${formatMoney(p.unit_price)})</option>`
          )
          .join('');
    } catch (err) {
      console.error(err);
      select.innerHTML = '<option value="">Failed to load products</option>';
    }
  }

  async function loadDashboard() {
    const { data } = await apiFetch('dashboard.php');
    if (!data.success) {
      throw new Error(data.message || 'Dashboard data unavailable.');
    }

    const s = data.stats || {};
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('statProducts', s.total_products ?? '0');
    setText('statCategories', s.total_categories ?? '0');
    setText('statSuppliers', s.total_suppliers ?? '0');
    setText('statLowStock', s.low_stock_count ?? '0');
    setText('statRevenue', formatMoney(s.total_sales_revenue ?? 0));
    setText('statSalesCount', s.total_sales_count ?? '0');

    const lowStock = data.low_stock || [];
    const lowBody = document.getElementById('lowStockTable');
    if (lowBody) {
      if (!lowStock.length) {
        lowBody.innerHTML = '<tr><td colspan="5" class="empty">All stock levels healthy</td></tr>';
      } else {
        lowBody.innerHTML = lowStock
          .map(
            (p) => `<tr>
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.sku)}</td>
          <td>${escapeHtml(p.category_name)}</td>
          <td><span class="badge badge-low">${p.quantity}</span></td>
          <td>${p.min_stock_level}</td>
        </tr>`
          )
          .join('');
      }
    }

    const recentSales = data.recent_sales || [];
    const salesBody = document.getElementById('recentSalesTable');
    if (salesBody) {
      if (!recentSales.length) {
        salesBody.innerHTML = '<tr><td colspan="4" class="empty">No sales yet</td></tr>';
      } else {
        salesBody.innerHTML = recentSales
          .map(
            (sale) => `<tr>
          <td>${escapeHtml(sale.product_name)}</td>
          <td>${sale.quantity_sold}</td>
          <td>${formatMoney(sale.total_amount)}</td>
          <td>${formatDate(sale.sold_at)}</td>
        </tr>`
          )
          .join('');
      }
    }

    const topList = document.getElementById('topProductsList');
    const topProducts = data.top_products || [];
    if (topList) {
      if (!topProducts.length) {
        topList.innerHTML = '<li class="empty">No sales data yet</li>';
      } else {
        topList.innerHTML = topProducts
          .map((p) => `<li><span>${escapeHtml(p.name)}</span><strong>${p.units_sold} sold</strong></li>`)
          .join('');
      }
    }
  }

  function bindSaleForm() {
    const form = document.getElementById('saleForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('saleMessage');
      const productId = document.getElementById('saleProduct')?.value;
      const qty = parseInt(document.getElementById('saleQty')?.value, 10);

      if (!productId) {
        if (msg) {
          msg.textContent = 'Select a product first.';
          msg.className = 'form-hint error';
        }
        return;
      }

      const { data } = await apiFetch('sales.php', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity_sold: qty }),
      });

      if (data.success) {
        if (msg) {
          msg.textContent = `Sold ${data.sale.quantity}× ${data.sale.product} — ${formatMoney(data.sale.total)}`;
          msg.className = 'form-hint success';
        }
        form.reset();
        const qtyInput = document.getElementById('saleQty');
        if (qtyInput) qtyInput.value = 1;
        await Promise.all([loadDashboard(), loadSaleProducts()]);
      } else if (msg) {
        msg.textContent = data.message || 'Sale failed.';
        msg.className = 'form-hint error';
      }
    });
  }

  async function boot() {
    try {
      bindSaleForm();
      await Promise.all([loadDashboard(), loadSaleProducts()]);
    } catch (err) {
      console.error(err);
      const lowBody = document.getElementById('lowStockTable');
      if (lowBody) {
        lowBody.innerHTML =
          '<tr><td colspan="5" class="empty">Failed to load dashboard. Refresh the page.</td></tr>';
      }
      await loadSaleProducts();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
