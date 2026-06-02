# Hosting Nova Shop

## Local hosting (your PC — XAMPP)

Your project is already in the web root:

`C:\xampp\htdocs\nova-shop`

### Quick start

1. Double-click **`start-website.bat`** (starts Apache + MySQL and opens the site), **or**
2. Open **XAMPP Control Panel** → Start **Apache** and **MySQL**

### URLs

| Page | URL |
|------|-----|
| Home (redirects to login) | http://localhost/nova-shop/ |
| Admin login | http://localhost/nova-shop/auth/login.php |
| Dashboard | http://localhost/nova-shop/dashboard.php |

**Demo login:** `admin` / `password`

### Requirements checklist

- [ ] Apache running (port 80)
- [ ] MySQL running (port **3307** on your machine — set in `config/database.php`)
- [ ] Database `nova_shop` imported from `database/schema.sql`

---

## Access from another device on your Wi‑Fi (LAN)

1. Start Apache and MySQL in XAMPP
2. On your PC, open Command Prompt and run: `ipconfig`
3. Note your **IPv4 Address** (e.g. `192.168.1.5`)
4. On the other phone/laptop (same Wi‑Fi), open:

   `http://192.168.1.5/nova-shop/`

5. If it does not load, allow **Apache** through Windows Firewall (Private network)

---

## Host online (public internet)

For a school project or demo, upload the `nova-shop` folder to PHP hosting that supports **MySQL**:

1. Export `nova_shop` from phpMyAdmin (Export → SQL)
2. Upload all project files via FTP or File Manager
3. Create a MySQL database on the host and import the SQL
4. Update `config/database.php` with the host’s DB host, name, user, password, and port (usually `3306`)

Popular free/low-cost PHP hosts: InfinityFree, 000webhost, or any shared hosting with PHP 8+ and MySQL.

For production, also change the default admin password and use HTTPS.

---

## PHP built-in server (development only)

```bash
cd C:\xampp\htdocs\nova-shop
C:\xampp\php\php.exe -S localhost:8000
```

Open http://localhost:8000 — MySQL must still be running in XAMPP.
