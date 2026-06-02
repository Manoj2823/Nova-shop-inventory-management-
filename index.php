<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/app.php';

if (isAdminLoggedIn()) {
    header('Location: ' . url('dashboard.php'));
} else {
    header('Location: ' . url('auth/login.php'));
}
exit;
