<?php
$page = 'suppliers';
$pageTitle = 'Suppliers';
require_once __DIR__ . '/includes/layout.php';
?>

<section class="page-toolbar">
    <p class="page-desc">Track vendor contacts and linked products.</p>
    <button type="button" class="btn btn-primary" id="btnAddSupplier">+ Add Supplier</button>
</section>

<div class="table-wrap panel card-3d">
    <table class="data-table" id="suppliersTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="6" class="empty">Loading suppliers…</td></tr>
        </tbody>
    </table>
</div>

<?php
$pageScript = 'suppliers.js';
require_once __DIR__ . '/includes/layout-end.php';
