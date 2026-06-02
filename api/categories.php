<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdmin();
header('Content-Type: application/json');

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare('
            SELECT c.*, COUNT(p.id) AS product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            WHERE c.id = ?
            GROUP BY c.id
        ');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            jsonResponse(['success' => false, 'message' => 'Category not found.'], 404);
        }
        jsonResponse(['success' => true, 'data' => $row]);
    }

    $rows = $db->query('
        SELECT c.*, COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
    ')->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $data = parseJsonInput();
    $error = validateRequired(['name'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    try {
        $stmt = $db->prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
        $stmt->execute([trim($data['name']), $data['description'] ?? null]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'message' => 'Category name already exists.'], 409);
    }
    jsonResponse(['success' => true, 'message' => 'Category created.', 'id' => (int) $db->lastInsertId()]);
}

if ($method === 'PUT' && $id) {
    $data = parseJsonInput();
    $error = validateRequired(['name'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    try {
        $stmt = $db->prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?');
        $stmt->execute([trim($data['name']), $data['description'] ?? null, $id]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'message' => 'Category name already exists.'], 409);
    }
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Category not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Category updated.']);
}

if ($method === 'DELETE' && $id) {
    $check = $db->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
    $check->execute([$id]);
    if ((int) $check->fetchColumn() > 0) {
        jsonResponse(['success' => false, 'message' => 'Cannot delete category with linked products.'], 409);
    }

    $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Category not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Category deleted.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
