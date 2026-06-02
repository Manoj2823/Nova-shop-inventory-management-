<?php
/**
 * Admin session authentication
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isAdminLoggedIn(): bool
{
    return !empty($_SESSION['admin_id']) && !empty($_SESSION['admin_username']);
}

function requireAdmin(): void
{
    if (!isAdminLoggedIn()) {
        if (isApiRequest()) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
            exit;
        }
        require_once __DIR__ . '/../config/app.php';
        header('Location: ' . url('auth/login.php'));
        exit;
    }
}

function isApiRequest(): bool
{
    return strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false
        || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));
}

function getAdminId(): int
{
    return (int) ($_SESSION['admin_id'] ?? 0);
}

function loginAdmin(int $id, string $username, string $fullName): void
{
    $_SESSION['admin_id'] = $id;
    $_SESSION['admin_username'] = $username;
    $_SESSION['admin_name'] = $fullName;
}

function logoutAdmin(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}
