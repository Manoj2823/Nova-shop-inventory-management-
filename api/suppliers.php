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
            SELECT s.*, COUNT(p.id) AS product_count
            FROM suppliers s
            LEFT JOIN products p ON s.id = p.supplier_id
            WHERE s.id = ?
            GROUP BY s.id
        ');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            jsonResponse(['success' => false, 'message' => 'Supplier not found.'], 404);
        }
        jsonResponse(['success' => true, 'data' => $row]);
    }

    $rows = $db->query('
        SELECT s.*, COUNT(p.id) AS product_count
        FROM suppliers s
        LEFT JOIN products p ON s.id = p.supplier_id
        GROUP BY s.id
        ORDER BY s.name ASC
    ')->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $data = parseJsonInput();
    $error = validateRequired(['name'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    $stmt = $db->prepare('
        INSERT INTO suppliers (name, contact_person, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        trim($data['name']),
        $data['contact_person'] ?? null,
        $data['email'] ?? null,
        $data['phone'] ?? null,
        $data['address'] ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Supplier created.', 'id' => (int) $db->lastInsertId()]);
}

if ($method === 'PUT' && $id) {
    $data = parseJsonInput();
    $error = validateRequired(['name'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    $stmt = $db->prepare('
        UPDATE suppliers SET
            name = ?, contact_person = ?, email = ?, phone = ?, address = ?
        WHERE id = ?
    ');
    $stmt->execute([
        trim($data['name']),
        $data['contact_person'] ?? null,
        $data['email'] ?? null,
        $data['phone'] ?? null,
        $data['address'] ?? null,
        $id,
    ]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Supplier not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Supplier updated.']);
}

if ($method === 'DELETE' && $id) {
    $db->prepare('UPDATE products SET supplier_id = NULL WHERE supplier_id = ?')->execute([$id]);
    $stmt = $db->prepare('DELETE FROM suppliers WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Supplier not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Supplier deleted.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
