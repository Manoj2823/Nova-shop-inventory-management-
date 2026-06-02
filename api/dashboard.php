<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdmin();
header('Content-Type: application/json');

$db = getDB();

$stats = $db->query('
    SELECT
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM suppliers) AS total_suppliers,
        (SELECT COUNT(*) FROM products WHERE quantity <= min_stock_level) AS low_stock_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM sales) AS total_sales_revenue,
        (SELECT COUNT(*) FROM sales) AS total_sales_count
')->fetch();

$lowStock = $db->query('
    SELECT p.id, p.name, p.sku, p.quantity, p.min_stock_level,
           c.name AS category_name
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.quantity <= p.min_stock_level
    ORDER BY p.quantity ASC
    LIMIT 10
')->fetchAll();

$recentSales = $db->query('
    SELECT s.id, s.quantity_sold, s.total_amount, s.sold_at,
           p.name AS product_name, p.sku
    FROM sales s
    INNER JOIN products p ON s.product_id = p.id
    ORDER BY s.sold_at DESC
    LIMIT 8
')->fetchAll();

$topProducts = $db->query('
    SELECT p.name, p.sku, COALESCE(SUM(s.quantity_sold), 0) AS units_sold
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id
    GROUP BY p.id
    ORDER BY units_sold DESC
    LIMIT 5
')->fetchAll();

jsonResponse([
    'success' => true,
    'stats' => $stats,
    'low_stock' => $lowStock,
    'recent_sales' => $recentSales,
    'top_products' => $topProducts,
]);
