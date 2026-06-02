<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/helpers.php';

requireAdmin();

$currentPage = $page ?? 'dashboard';
$adminName = $_SESSION['admin_name'] ?? $_SESSION['admin_username'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= sanitize($pageTitle ?? 'Dashboard') ?> — Nova Shop</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="app-body">
    <div class="app-shell">
        <aside class="sidebar card-3d" id="sidebar">
            <div class="sidebar-brand">
                <span class="logo-icon">◆</span>
                <div>
                    <strong>Nova Shop</strong>
                    <small>Inventory</small>
                </div>
            </div>
            <nav class="sidebar-nav">
                <a href="<?= url('dashboard.php') ?>" class="nav-link <?= $currentPage === 'dashboard' ? 'active' : '' ?>">
                    <span class="nav-icon">▣</span> Dashboard
                </a>
                <a href="<?= url('products.php') ?>" class="nav-link <?= $currentPage === 'products' ? 'active' : '' ?>">
                    <span class="nav-icon">▤</span> Products
                </a>
                <a href="<?= url('categories.php') ?>" class="nav-link <?= $currentPage === 'categories' ? 'active' : '' ?>">
                    <span class="nav-icon">▦</span> Categories
                </a>
                <a href="<?= url('suppliers.php') ?>" class="nav-link <?= $currentPage === 'suppliers' ? 'active' : '' ?>">
                    <span class="nav-icon">▧</span> Suppliers
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="admin-badge">
                    <span class="admin-avatar"><?= strtoupper(substr($adminName, 0, 1)) ?></span>
                    <div>
                        <small>Logged in as</small>
                        <strong><?= sanitize($adminName) ?></strong>
                    </div>
                </div>
                <a href="<?= url('auth/logout.php') ?>" class="btn btn-ghost btn-sm">Logout</a>
            </div>
        </aside>

        <div class="main-wrap">
            <header class="topbar">
                <button type="button" class="menu-toggle" id="menuToggle" aria-label="Toggle menu">☰</button>
                <h1 class="page-title"><?= sanitize($pageTitle ?? 'Dashboard') ?></h1>
                <div class="topbar-actions">
                    <span class="live-pill" id="stockStatus">Checking stock…</span>
                </div>
            </header>
            <main class="main-content">
