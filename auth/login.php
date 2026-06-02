<?php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../config/app.php';

if (isAdminLoggedIn()) {
    header('Location: ' . url('dashboard.php'));
    exit;
}

$error = $_GET['error'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Nova Shop</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page">
    <div class="auth-scene">
        <div class="auth-card card-3d">
            <div class="auth-logo">
                <span class="logo-icon">◆</span>
                <h1>Nova Shop</h1>
                <p>Inventory Management</p>
            </div>
            <?php if ($error): ?>
                <div class="alert alert-error"><?= sanitize($error) ?></div>
            <?php endif; ?>
            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required autocomplete="username" placeholder="admin">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary btn-glow">Sign In</button>
            </form>
            <p class="auth-footer">No account? <a href="<?= url('auth/register.php') ?>">Register as Admin</a></p>
            <p class="auth-hint">Demo: admin / password</p>
        </div>
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
    </div>
    <script>window.APP_BASE = <?= json_encode(url()) ?>;</script>
    <script src="<?= asset('js/auth.js') ?>"></script>
</body>
</html>
