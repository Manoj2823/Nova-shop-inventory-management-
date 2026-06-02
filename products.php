<?php
$page = 'products';
$pageTitle = 'Products';
require_once __DIR__ . '/includes/layout.php';
?>

<section class="page-toolbar">
    <p class="page-desc">Manage stock with category and supplier links (SQL JOINs).</p>
    <button type="button" class="btn btn-primary" id="btnAddProduct">+ Add Product</button>
</section>

<div class="table-wrap panel card-3d">
    <table class="data-table" id="productsTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Qty</th>
                <th>Min</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="8" class="empty">Loading products…</td></tr>
        </tbody>
    </table>
</div>

<?php
$pageScript = 'products.js';
require_once __DIR__ . '/includes/layout-end.php';
