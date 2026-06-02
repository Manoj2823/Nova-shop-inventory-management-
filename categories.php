<?php
$page = 'categories';
$pageTitle = 'Categories';
require_once __DIR__ . '/includes/layout.php';
?>

<section class="page-toolbar">
    <p class="page-desc">Organize products into categories.</p>
    <button type="button" class="btn btn-primary" id="btnAddCategory">+ Add Category</button>
</section>

<div class="cards-grid" id="categoriesGrid">
    <p class="empty">Loading categories…</p>
</div>

<?php
$pageScript = 'categories.js';
require_once __DIR__ . '/includes/layout-end.php';
