<?php
/**
 * MySQL database connection via PDO
 * Update credentials to match your phpMyAdmin / XAMPP setup
 */

define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3307);
define('DB_NAME', 'nova_shop');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            $mysqlCode = (int) ($e->errorInfo[1] ?? 0);
            $message = match ($mysqlCode) {
                1045 => 'MySQL access denied. Set DB_USER and DB_PASS in config/database.php to match your phpMyAdmin login (XAMPP default is root with an empty password).',
                1049 => 'Database "' . DB_NAME . '" not found. Import database/schema.sql in phpMyAdmin.',
                2002 => 'Cannot reach MySQL. Start MySQL in the XAMPP Control Panel, then try again.',
                default => 'Database connection failed. Check config/database.php, import database/schema.sql, and ensure MySQL is running.',
            };
            die(json_encode(['success' => false, 'message' => $message]));
        }
    }

    return $pdo;
}
