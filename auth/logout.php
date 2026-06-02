<?php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/app.php';

logoutAdmin();
header('Location: ' . url('auth/login.php'));
exit;
