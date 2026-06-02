# Nova Shop — Inventory Management System

A small retail inventory app with **PHP + MySQL**, admin authentication, CRUD, SQL JOINs, sales tracking, and a modern responsive dashboard with 3D UI effects.

## Requirements

- PHP 8.0+ with PDO MySQL
- MySQL / MariaDB (XAMPP, WAMP, or Laragon)
- phpMyAdmin (optional, for importing schema)
- Apache (recommended) or PHP built-in server

## Host locally (XAMPP)

1. Copy this folder to `C:\xampp\htdocs\nova-shop`
2. Import `database/schema.sql` in phpMyAdmin
3. Set `config/database.php` (port `3307` if that is your MySQL port)
4. Double-click **`start-website.bat`** in the project folder, or start **Apache** and **MySQL** in XAMPP Control Panel
5. Open **http://localhost/nova-shop/**

See **[HOSTING.md](HOSTING.md)** for LAN access and online hosting options.

### Default admin login

| Username | Password  |
|----------|-----------|
| `admin`  | `password` |

You can also **Register** a new admin account.

## Features

- **Admin only**: Login / registration; all dashboard and API routes require session
- **CRUD**: Products, Categories, Suppliers
- **SQL JOINs**: Products list joins categories & suppliers; sales join products & categories
- **Sales**: Record sales with stock deduction (transactions)
- **Low stock**: JavaScript `alert()` on dashboard load when quantity ≤ min level
- **UI**: Sidebar navigation, glassmorphism, 3D card tilt, responsive layout

## Project structure

```
nova-shop/
├── api/           # JSON REST endpoints (admin protected)
├── auth/          # Login, register, logout
├── assets/        # CSS & JavaScript
├── config/        # Database & app URL helpers
├── database/      # schema.sql
├── includes/      # Auth, layout, helpers
├── dashboard.php
├── products.php
├── categories.php
└── suppliers.php
```

## PHP built-in server (development)

```bash
cd nova-shop
php -S localhost:8000
```

Then open `http://localhost:8000` (base path is `/`).

## Learning topics covered

- Relational schema with foreign keys
- `INNER JOIN` and `LEFT JOIN` in queries
- PDO prepared statements
- Session-based authorization
- REST-style CRUD with JSON API
