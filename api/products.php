<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdmin();
header('Content-Type: application/json');

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

$productSelect = '
    SELECT p.*,
           c.name AS category_name,
           s.name AS supplier_name
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
';

if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare($productSelect . ' WHERE p.id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) {
            jsonResponse(['success' => false, 'message' => 'Product not found.'], 404);
        }
        jsonResponse(['success' => true, 'data' => $product]);
    }

    $lowStock = isset($_GET['low_stock']);
    $sql = $productSelect;
    if ($lowStock) {
        $sql .= ' WHERE p.quantity <= p.min_stock_level ORDER BY p.quantity ASC';
    } else {
        $sql .= ' ORDER BY p.name ASC';
    }
    $rows = $db->query($sql)->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $data = parseJsonInput();
    $error = validateRequired(['name', 'sku', 'category_id', 'quantity', 'unit_price'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    $stmt = $db->prepare('
        INSERT INTO products (name, sku, description, category_id, supplier_id, quantity, min_stock_level, unit_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ');
    try {
        $stmt->execute([
            trim($data['name']),
            trim($data['sku']),
            $data['description'] ?? null,
            (int) $data['category_id'],
            !empty($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            (int) $data['quantity'],
            (int) ($data['min_stock_level'] ?? 10),
            (float) $data['unit_price'],
        ]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'message' => 'SKU must be unique or invalid references.'], 409);
    }

    jsonResponse(['success' => true, 'message' => 'Product created.', 'id' => (int) $db->lastInsertId()]);
}

if ($method === 'PUT' && $id) {
    $data = parseJsonInput();
    $error = validateRequired(['name', 'sku', 'category_id', 'quantity', 'unit_price'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    $stmt = $db->prepare('
        UPDATE products SET
            name = ?, sku = ?, description = ?, category_id = ?, supplier_id = ?,
            quantity = ?, min_stock_level = ?, unit_price = ?
        WHERE id = ?
    ');
    try {
        $stmt->execute([
            trim($data['name']),
            trim($data['sku']),
            $data['description'] ?? null,
            (int) $data['category_id'],
            !empty($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            (int) $data['quantity'],
            (int) ($data['min_stock_level'] ?? 10),
            (float) $data['unit_price'],
            $id,
        ]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'message' => 'Update failed. Check SKU uniqueness.'], 409);
    }

    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Product not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Product updated.']);
}

if ($method === 'DELETE' && $id) {
    $check = $db->prepare('SELECT COUNT(*) FROM sales WHERE product_id = ?');
    $check->execute([$id]);
    if ((int) $check->fetchColumn() > 0) {
        jsonResponse(['success' => false, 'message' => 'Cannot delete product with sales history.'], 409);
    }

    $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Product not found.'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Product deleted.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
