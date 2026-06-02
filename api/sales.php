<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdmin();
header('Content-Type: application/json');

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $db->query('
        SELECT s.*, p.name AS product_name, p.sku, c.name AS category_name
        FROM sales s
        INNER JOIN products p ON s.product_id = p.id
        INNER JOIN categories c ON p.category_id = c.id
        ORDER BY s.sold_at DESC
        LIMIT 100
    ')->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $data = parseJsonInput();
    $error = validateRequired(['product_id', 'quantity_sold'], $data);
    if ($error) {
        jsonResponse(['success' => false, 'message' => $error], 400);
    }

    $qty = (int) $data['quantity_sold'];
    if ($qty <= 0) {
        jsonResponse(['success' => false, 'message' => 'Quantity must be greater than zero.'], 400);
    }

    $productId = (int) $data['product_id'];

    try {
        $db->beginTransaction();

        $stmt = $db->prepare('SELECT id, quantity, unit_price, name FROM products WHERE id = ? FOR UPDATE');
        $stmt->execute([$productId]);
        $product = $stmt->fetch();

        if (!$product) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Product not found.'], 404);
        }

        if ((int) $product['quantity'] < $qty) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Insufficient stock for ' . $product['name'] . '.'], 409);
        }

        $unitPrice = (float) $product['unit_price'];
        $total = round($unitPrice * $qty, 2);

        $db->prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?')->execute([$qty, $productId]);

        $sale = $db->prepare('
            INSERT INTO sales (product_id, quantity_sold, unit_price, total_amount)
            VALUES (?, ?, ?, ?)
        ');
        $sale->execute([$productId, $qty, $unitPrice, $total]);

        $db->commit();

        jsonResponse([
            'success' => true,
            'message' => 'Sale recorded.',
            'sale' => [
                'product' => $product['name'],
                'quantity' => $qty,
                'total' => $total,
            ],
        ]);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Sale failed.'], 500);
    }
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
