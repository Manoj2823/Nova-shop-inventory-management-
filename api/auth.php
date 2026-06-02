<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'login') {
    $data = $_POST ?: parseJsonInput();
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if ($username === '' || $password === '') {
        jsonResponse(['success' => false, 'message' => 'Username and password are required.'], 400);
    }

    $stmt = getDB()->prepare('SELECT id, username, password_hash, full_name FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid username or password.'], 401);
    }

    loginAdmin((int) $admin['id'], $admin['username'], $admin['full_name']);
    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'redirect' => url('dashboard.php'),
        'admin' => ['username' => $admin['username'], 'full_name' => $admin['full_name']],
    ]);
}

if ($method === 'POST' && $action === 'register') {
    $data = parseJsonInput();
    if (empty($data)) {
        $data = $_POST;
    }

    $error = validateRequired(['full_name', 'email', 'username', 'password'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    if (($data['password'] ?? '') !== ($data['confirm_password'] ?? '')) {
        jsonResponse(['success' => false, 'message' => 'Passwords do not match.'], 400);
    }

    if (strlen($data['password']) < 6) {
        jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters.'], 400);
    }

    $db = getDB();
    $check = $db->prepare('SELECT id FROM admins WHERE username = ? OR email = ?');
    $check->execute([$data['username'], $data['email']]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Username or email already exists.'], 409);
    }

    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $insert = $db->prepare('INSERT INTO admins (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)');
    $insert->execute([
        trim($data['username']),
        trim($data['email']),
        $hash,
        trim($data['full_name']),
    ]);

    jsonResponse(['success' => true, 'message' => 'Registration successful. You can now log in.', 'redirect' => url('auth/login.php')]);
}

jsonResponse(['success' => false, 'message' => 'Invalid request.'], 405);
