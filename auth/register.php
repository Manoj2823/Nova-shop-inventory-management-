<?php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/app.php';

if (isAdminLoggedIn()) {
    header('Location: ' . url('dashboard.php'));
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration — Nova Shop</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page">
    <div class="auth-scene">
        <div class="auth-card card-3d">
            <div class="auth-logo">
                <span class="logo-icon">◆</span>
                <h1>Create Admin</h1>
                <p>Register for panel access</p>
            </div>
            <div id="registerAlert"></div>
            <form id="registerForm" class="auth-form">
                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <input type="text" id="full_name" name="full_name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required minlength="3">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-glow">Create Account</button>
            </form>
            <p class="auth-footer">Already registered? <a href="<?= url('auth/login.php') ?>">Sign in</a></p>
        </div>
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
    </div>
    <script>window.APP_BASE = <?= json_encode(url()) ?>;</script>
    <script src="<?= asset('js/auth.js') ?>"></script>
</body>
</html>
