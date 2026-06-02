-- Nova Shop Inventory Management System
-- Import this file in phpMyAdmin or run via MySQL CLI

CREATE DATABASE IF NOT EXISTS nova_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nova_shop;

-- Admins (admin panel access only)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (relational links to category & supplier)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category_id INT NOT NULL,
    supplier_id INT,
    quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Sales history
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity_sold INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Indexes for JOIN performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_products_quantity ON products(quantity);

-- Sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets and electronic devices'),
('Clothing', 'Apparel and accessories'),
('Groceries', 'Food and daily essentials');

-- Sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('TechSupply Co.', 'Jane Doe', 'jane@techsupply.com', '555-0101', '123 Tech Ave'),
('Fashion Hub', 'Mike Smith', 'mike@fashionhub.com', '555-0102', '456 Style St'),
('FreshMart Wholesale', 'Sarah Lee', 'sarah@freshmart.com', '555-0103', '789 Market Rd');

-- Sample products (some low stock for alert demo)
INSERT INTO products (name, sku, description, category_id, supplier_id, quantity, min_stock_level, unit_price) VALUES
('Wireless Mouse', 'ELEC-001', 'Ergonomic wireless mouse', 1, 1, 45, 10, 24.99),
('USB-C Cable', 'ELEC-002', '2m braided USB-C cable', 1, 1, 8, 15, 12.50),
('Cotton T-Shirt', 'CLTH-001', 'Unisex cotton tee', 2, 2, 120, 20, 19.99),
('Denim Jeans', 'CLTH-002', 'Classic fit denim', 2, 2, 5, 10, 49.99),
('Organic Coffee', 'GROC-001', '1kg organic beans', 3, 3, 30, 15, 18.00),
('Olive Oil', 'GROC-002', '500ml extra virgin', 3, 3, 3, 10, 14.50);

-- Default admin: username=admin, password=password (change after first login)
INSERT INTO admins (username, email, password_hash, full_name) VALUES
('admin', 'admin@novashop.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator');
