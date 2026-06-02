<?php
$page = 'dashboard';
$pageTitle = 'Dashboard';
require_once __DIR__ . '/includes/layout.php';
?>

<section class="stats-grid" id="statsGrid">
    <article class="stat-card card-3d tilt">
        <span class="stat-label">Products</span>
        <span class="stat-value" id="statProducts">—</span>
    </article>
    <article class="stat-card card-3d tilt">
        <span class="stat-label">Categories</span>
        <span class="stat-value" id="statCategories">—</span>
    </article>
    <article class="stat-card card-3d tilt">
        <span class="stat-label">Suppliers</span>
        <span class="stat-value" id="statSuppliers">—</span>
    </article>
    <article class="stat-card card-3d tilt alert-stat">
        <span class="stat-label">Low Stock</span>
        <span class="stat-value" id="statLowStock">—</span>
    </article>
    <article class="stat-card card-3d tilt">
        <span class="stat-label">Sales Revenue</span>
        <span class="stat-value" id="statRevenue">—</span>
    </article>
    <article class="stat-card card-3d tilt">
        <span class="stat-label">Total Sales</span>
        <span class="stat-value" id="statSalesCount">—</span>
    </article>
</section>

<div class="dashboard-grid">
    <section class="panel card-3d">
        <div class="panel-header">
            <h2>Record Sale</h2>
        </div>
        <form id="saleForm" class="inline-form">
            <select id="saleProduct" name="product_id" required>
                <option value="">Select product…</option>
            </select>
            <input type="number" id="saleQty" name="quantity_sold" min="1" value="1" required placeholder="Qty">
            <button type="submit" class="btn btn-primary">Sell</button>
        </form>
        <p id="saleMessage" class="form-hint"></p>
    </section>

    <section class="panel card-3d">
        <div class="panel-header">
            <h2>Low Stock Items</h2>
        </div>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Min</th>
                    </tr>
                </thead>
                <tbody id="lowStockTable">
                    <tr><td colspan="5" class="empty">Loading…</td></tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="panel card-3d">
        <div class="panel-header">
            <h2>Recent Sales</h2>
        </div>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="recentSalesTable">
                    <tr><td colspan="4" class="empty">Loading…</td></tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="panel card-3d">
        <div class="panel-header">
            <h2>Top Sellers</h2>
        </div>
        <ul class="rank-list" id="topProductsList"></ul>
    </section>
</div>

<?php
$pageScript = 'dashboard.js';
require_once __DIR__ . '/includes/layout-end.php';
