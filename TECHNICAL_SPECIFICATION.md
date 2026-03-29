# 🏞️ Yedideğirmenler Tabiat Parkı QR Menü Sistemi
## Comprehensive Technical Specification & Development Guide

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Development Ready  
**Author:** QR Menu Development Team

---

## 📋 İçindekiler
1. [Proje Özeti](#proje-özeti)
2. [Teknoloji Stack Seçenekleri](#teknoloji-stack)
3. [Sistem Mimarisi](#sistem-mimarisi)
4. [Database Şeması](#database-şeması)
5. [API Endpoints](#api-endpoints)
6. [Güvenlik Spesifikasyonları](#güvenlik)
7. [Frontend Blueprint (Antigravity)](#frontend-blueprint)
8. [Admin Panel Requirements](#admin-panel)
9. [Dil & İçerik Sistemi](#dil-sistem)
10. [Deployment Guide](#deployment)
11. [Test & QA Checklist](#test-checklist)

---

## 🎯 Proje Özeti

### Amaç
Karadeniz bölgesini yansıtan, doğa temalı, modern ve etkileşimli QR kod menü sistemi.

### Ana Özellikler
- ✅ %100 Mobil Responsive Design
- ✅ Doğa Temalı (Su değirmenleri, Karadeniz)
- ✅ Admin Panel (Kategoriler, Ürünler, Alerjenler, Ayarlar)
- ✅ Multi-Language (TR, EN, AR) + Google Translate
- ✅ Alerjen Bilgileri & Beslensel Değerler
- ✅ Flaticon Entegrasyonu (Modern İkonlar)
- ✅ Header/Footer Mobil-Masaüstü Ayrımı
- ✅ Interaktif Görseller & Animasyonlar
- ✅ Enterprise-Grade Güvenlik

### Target Kullanıcılar
1. **Müşteriler** - QR kod ile menü görüntüleme
2. **Admin** - İçerik yönetimi, ayarlar, analitics
3. **Yöneticiler** - İş analizi, raporlar

---

## 🛠️ Teknoloji Stack Seçenekleri

### ✅ REKOMENDED: Node.js + Express (Modern, Contemporary)

#### Avantajları
- **Async/Await** - Asynchronous operations
- **JSON Native** - REST API için ideal
- **Real-time** - WebSocket desteği
- **NPM Ecosystem** - Zengin kütüphane
- **TypeScript** - Type-safe development
- **Performance** - Fast & scalable
- **Modern** - 2024 standards

#### Stack Detayları
```
Frontend:
  - React 18+ / Vue 3 (via Antigravity)
  - TailwindCSS / shadcn/ui
  - Flaticon integration

Backend:
  - Node.js 18+
  - Express.js 4.18+
  - TypeScript 5+

Database:
  - MySQL 8.0+ / MariaDB 10.6+
  - Prisma ORM (Modern, Type-safe)
  - Redis (Cache)

Authentication:
  - JWT (JSON Web Tokens)
  - bcrypt password hashing
  - Session management

Hosting:
  - Docker containerized
  - VPS / Cloud (AWS, Google Cloud, DigitalOcean)
  - PM2 for process management
  - Nginx reverse proxy

Tools:
  - ESLint + Prettier
  - Jest (Testing)
  - Swagger/OpenAPI (Docs)
```

---

## 🏗️ Sistem Mimarisi

### System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              QR Kod Taraması                     │
│         (Customer/Müşteri Taraması)              │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │  Public Menu UI   │
        │  (Antigravity)    │
        │  - Categories     │
        │  - Products       │
        │  - Allergens      │
        │  - Multi-language │
        └────────┬──────────┘
                 │
    ┌────────────▼─────────────┐
    │   REST API / GraphQL      │
    │  (Node.js + Express)      │
    │                           │
    │  ├─ /api/categories       │
    │  ├─ /api/products         │
    │  ├─ /api/allergens        │
    │  ├─ /api/settings         │
    │  ├─ /api/auth             │
    │  └─ /api/admin/*          │
    └────────────┬──────────────┘
                 │
    ┌────────────▼────────────┐
    │   Business Logic Layer   │
    │                          │
    │  ├─ Auth Service         │
    │  ├─ Product Service      │
    │  ├─ Category Service     │
    │  ├─ Allergen Service     │
    │  ├─ Language Service     │
    │  └─ Analytics Service    │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────┐
    │   Data Access Layer      │
    │                          │
    │  ├─ Prisma ORM           │
    │  ├─ Repository Pattern    │
    │  └─ Query Optimization    │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────────┐
    │   MySQL Database             │
    │                              │
    │  ├─ Users (Admin)            │
    │  ├─ Categories               │
    │  ├─ Products                 │
    │  ├─ Allergens                │
    │  ├─ Translations             │
    │  ├─ Settings                 │
    │  ├─ Layout (Mobile/Desktop)  │
    │  └─ Audit Logs               │
    └──────────────────────────────┘

┌──────────────────────────┐
│   Admin Panel (React)     │
│   (Antigravity)           │
│                           │
│  Dashboard                │
│  ├─ Site Settings        │
│  ├─ Categories CRUD      │
│  ├─ Products CRUD        │
│  ├─ Allergens CRUD       │
│  ├─ Header/Footer        │
│  │  (Mobile/Desktop)      │
│  ├─ Language Management   │
│  ├─ User Management       │
│  └─ Audit Logs            │
└───────────┬───────────────┘
            │
            └──► JWT Auth ──┐
                             │
                    ┌────────▼──────┐
                    │  API Tokens     │
                    │  (Secure)       │
                    └─────────────────┘
```

---

## 📊 Database Şeması

### Tablo: `admin_users`
```sql
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `categories`
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_code VARCHAR(20),
    color_code VARCHAR(7),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `products`
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    detailed_content LONGTEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    image_path VARCHAR(255),
    image_alt_text VARCHAR(255),
    preparation_time INT,
    serving_size VARCHAR(50),
    calories INT,
    protein DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `allergen_types`
```sql
CREATE TABLE allergen_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon_code VARCHAR(20),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Predefined Allergen Types
INSERT INTO allergen_types (code, name, icon_code, sort_order) VALUES
('gluten', 'Gluten', 'fi-rr-bread', 1),
('milk', 'Süt', 'fi-rr-milk', 2),
('eggs', 'Yumurta', 'fi-rr-egg', 3),
('peanuts', 'Yer Fıstığı', 'fi-rr-peanut', 4),
('nuts', 'Ağaç Fındık', 'fi-rr-nut', 5),
('fish', 'Balık', 'fi-rr-fish', 6),
('shellfish', 'Karides/Midye', 'fi-rr-shrimp', 7),
('soy', 'Soya', 'fi-rr-soybean', 8),
('sesame', 'Susam', 'fi-rr-sesame', 9),
('sulfites', 'Sülfitler', 'fi-rr-wine', 10),
('celery', 'Kereviz', 'fi-rr-celery', 11),
('mustard', 'Hardal', 'fi-rr-mustard', 12),
('lupin', 'Lupini', 'fi-rr-bean', 13);
```

### Tablo: `product_allergens`
```sql
CREATE TABLE product_allergens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    allergen_id INT NOT NULL,
    severity ENUM('trace', 'low', 'medium', 'high') DEFAULT 'trace',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergen_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_allergen (product_id, allergen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `languages`
```sql
CREATE TABLE languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    google_translate_code VARCHAR(10),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO languages (code, name, native_name, is_active, is_default, google_translate_code, sort_order) VALUES
('tr', 'Turkish', 'Türkçe', TRUE, TRUE, 'tr', 1),
('en', 'English', 'English', TRUE, FALSE, 'en', 2),
('ar', 'Arabic', 'العربية', TRUE, FALSE, 'ar', 3);
```

### Tablo: `translations`
```sql
CREATE TABLE translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    language_code VARCHAR(5) NOT NULL,
    entity_type ENUM('category', 'product', 'setting') NOT NULL,
    entity_id INT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translation_text LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_translation (language_code, entity_type, entity_id, field_name),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_language (language_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `site_settings`
```sql
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    description VARCHAR(255),
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id),
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'Yedideğirmenler Tabiat Parkı', 'text', 'Ana başlık'),
('site_subtitle', 'Kafe & Restorant', 'text', 'Alt başlık'),
('site_description', 'Karadeniz\'in kalbinde doğal lezzetler', 'text', 'Site açıklaması'),
('phone', '+90 456 123 45 67', 'text', 'İletişim telefonu'),
('email', 'info@yedidegirmenler.com', 'text', 'İletişim email'),
('address', 'Karadeniz Bölgesi, Tabiat Parkı', 'text', 'Fiziki adres'),
('business_hours', 'Her Gün: 08:00 - 23:00', 'text', 'İşletme saatleri'),
('header_mobile_enabled', TRUE, 'boolean', 'Mobil header aktif'),
('footer_mobile_enabled', TRUE, 'boolean', 'Mobil footer aktif'),
('header_desktop_enabled', TRUE, 'boolean', 'Masaüstü header aktif'),
('footer_desktop_enabled', TRUE, 'boolean', 'Masaüstü footer aktif');
```

### Tablo: `layout_settings`
```sql
CREATE TABLE layout_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_type ENUM('mobile', 'desktop') NOT NULL,
    section_type ENUM('header', 'footer') NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY unique_layout (device_type, section_type, setting_key),
    FOREIGN KEY (updated_by) REFERENCES admin_users(id),
    INDEX idx_device (device_type),
    INDEX idx_section (section_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tablo: `audit_logs`
```sql
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id),
    INDEX idx_admin (admin_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔌 API Endpoints

### Public API (Müşteri Tarafı)

#### 1. Kategoriler
```
GET /api/v1/categories
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kahvaltı",
      "slug": "kahvalti",
      "icon": "fi-rr-utensils",
      "color": "#d4a574",
      "products_count": 5
    }
  ]
}
```

#### 2. Ürünler (Kategori bazlı)
```
GET /api/v1/categories/:categorySlug/products
Query Params:
  - lang: tr|en|ar (default: tr)
  - include_allergens: true|false

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Menemen",
      "description": "Domates, biber ve yumurta",
      "price": 45,
      "discount_price": null,
      "image_url": "/uploads/products/menemen.jpg",
      "preparation_time": 15,
      "serving_size": "250gr",
      "nutrition": {
        "calories": 320,
        "protein": 12,
        "fat": 18,
        "carbs": 25
      },
      "allergens": [
        {
          "id": 3,
          "name": "Yumurta",
          "icon": "fi-rr-egg",
          "severity": "medium"
        }
      ],
      "is_available": true,
      "is_featured": true
    }
  ]
}
```

#### 3. Ürün Detayı
```
GET /api/v1/products/:productSlug
Query Params:
  - lang: tr|en|ar

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Menemen",
    "detailed_content": "Açık açıklaması...",
    "price": 45,
    "category": { "id": 1, "name": "Kahvaltı" },
    "allergens": [...],
    "nutrition": {...},
    "related_products": [...]
  }
}
```

#### 4. Site Ayarları
```
GET /api/v1/settings
Response:
{
  "success": true,
  "data": {
    "site_title": "Yedideğirmenler Tabiat Parkı",
    "phone": "+90 456 123 45 67",
    "email": "info@yedidegirmenler.com",
    "business_hours": "Her Gün: 08:00 - 23:00"
  }
}
```

#### 5. Layout Ayarları (Mobil/Masaüstü)
```
GET /api/v1/layout/:deviceType/:sectionType
Params:
  - deviceType: mobile|desktop
  - sectionType: header|footer

Response:
{
  "success": true,
  "data": {
    "device_type": "mobile",
    "section_type": "header",
    "settings": {
      "logo_url": "/uploads/logo.png",
      "background_color": "#1a3a2a",
      "menu_items": [...]
    }
  }
}
```

---

### Admin API (Admin Tarafı - JWT Authentication gereklidir)

#### Authentication

##### Login
```
POST /api/v1/admin/auth/login
{
  "username": "admin",
  "password": "secure_password"
}

Response (Success):
{
  "success": true,
  "token": "eyJhbGc...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}

Response (Error):
{
  "success": false,
  "error": "Kullanıcı adı veya şifre hatalı"
}
```

##### Change Password
```
POST /api/v1/admin/auth/change-password
Headers:
  Authorization: Bearer {token}

{
  "old_password": "current_password",
  "new_password": "new_secure_password"
}
```

#### Site Settings Management

##### Get Settings
```
GET /api/v1/admin/settings
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "site_title": "...",
    "site_subtitle": "...",
    ...
  }
}
```

##### Update Settings
```
PUT /api/v1/admin/settings
Headers:
  Authorization: Bearer {token}

{
  "site_title": "Yeni Başlık",
  "phone": "+90 123 456 78 90",
  ...
}
```

#### Categories Management

##### List Categories
```
GET /api/v1/admin/categories
Headers:
  Authorization: Bearer {token}
Query Params:
  - page: 1
  - limit: 20
  - sort: sort_order|name|created_at
  - order: asc|desc

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kahvaltı",
      "slug": "kahvalti",
      "icon": "fi-rr-utensils",
      "color": "#d4a574",
      "sort_order": 1,
      "is_active": true,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

##### Create Category
```
POST /api/v1/admin/categories
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Yeni Kategori",
  "description": "Açıklaması",
  "icon": "fi-rr-utensils",
  "color": "#d4a574",
  "sort_order": 1
}

Response:
{
  "success": true,
  "data": { "id": 2, "name": "Yeni Kategori", ... }
}
```

##### Update Category
```
PUT /api/v1/admin/categories/:id
Headers:
  Authorization: Bearer {token}

{
  "name": "Güncellenmiş Adı",
  "description": "Yeni açıklama",
  ...
}
```

##### Delete Category
```
DELETE /api/v1/admin/categories/:id
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Kategori başarıyla silindi"
}
```

#### Products Management

##### Create Product
```
POST /api/v1/admin/products
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "category_id": 1,
  "name": "Menemen",
  "description": "Domates, biber ve yumurta",
  "detailed_content": "Uzun açıklama...",
  "price": 45,
  "discount_price": 40,
  "image": <file>,
  "preparation_time": 15,
  "serving_size": "250gr",
  "calories": 320,
  "protein": 12,
  "fat": 18,
  "carbs": 25,
  "allergen_ids": [3, 2],
  "is_available": true,
  "is_featured": true,
  "sort_order": 1
}
```

##### Update Product
```
PUT /api/v1/admin/products/:id
Headers:
  Authorization: Bearer {token}

{
  "name": "Güncellenmiş Adı",
  "price": 50,
  ...
}
```

##### Upload Product Image
```
POST /api/v1/admin/products/:id/image
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "image": <file>
}

Response:
{
  "success": true,
  "data": {
    "image_url": "/uploads/products/menemen-123.jpg",
    "image_alt_text": "Menemen"
  }
}
```

#### Allergens Management

##### List Allergens
```
GET /api/v1/admin/allergens
Headers:
  Authorization: Bearer {token}
```

##### Add Allergen to Product
```
POST /api/v1/admin/products/:id/allergens
Headers:
  Authorization: Bearer {token}

{
  "allergen_id": 3,
  "severity": "medium"
}
```

#### Layout Management

##### Get Layout Settings
```
GET /api/v1/admin/layout/:deviceType/:sectionType
Headers:
  Authorization: Bearer {token}

Params:
  - deviceType: mobile|desktop
  - sectionType: header|footer
```

##### Update Layout Settings
```
PUT /api/v1/admin/layout/:deviceType/:sectionType
Headers:
  Authorization: Bearer {token}

{
  "logo_url": "/uploads/logo.png",
  "background_color": "#1a3a2a",
  "menu_items": [...]
}
```

#### Translations Management

##### Add Translation
```
POST /api/v1/admin/translations
Headers:
  Authorization: Bearer {token}

{
  "language_code": "en",
  "entity_type": "product",
  "entity_id": 1,
  "field_name": "name",
  "translation_text": "Menemen"
}
```

#### Audit Logs

##### Get Audit Logs
```
GET /api/v1/admin/audit-logs
Headers:
  Authorization: Bearer {token}
Query Params:
  - admin_id: <id>
  - action: create|update|delete
  - entity_type: category|product|setting
  - from_date: 2024-01-01
  - to_date: 2024-01-31
```

---

## 🔐 Güvenlik Spesifikasyonları

### 1. Authentication & Authorization
```
✅ JWT (JSON Web Tokens) kullanımı
   - Token Expiry: 24 saat
   - Refresh Token: 7 gün
   - Algorithm: HS256

✅ Password Hashing
   - Algoritma: bcrypt
   - Salt Rounds: 12
   - Min Length: 8 karakter
   - Complexity: uppercase, lowercase, number, special char

✅ Rate Limiting
   - Login attempts: 5 deneme
   - Lockout duration: 15 dakika
   - API rate limit: 100 req/minute

✅ Session Management
   - Session timeout: 30 dakika
   - Session regeneration: Her login'de
   - Session hijacking protection: IP + User-Agent verification
```

### 2. Input Validation & Sanitization
```
✅ SQL Injection Prevention
   - Parameterized queries (Prepared Statements)
   - Prisma ORM kullanımı
   - Input validation

✅ XSS Prevention
   - HTML escaping
   - Content Security Policy (CSP) headers
   - DOMPurify library (Frontend)

✅ CSRF Protection
   - CSRF tokens
   - SameSite cookie attribute
   - Double-submit cookies

✅ Data Validation
   - Email validation
   - URL validation
   - File type & size validation
   - Input length limits
```

### 3. File Upload Security
```
✅ Restrictions
   - Allowed types: JPG, PNG, GIF, WebP
   - Max size: 5 MB
   - Rename files randomly
   - Store outside web root

✅ Processing
   - Re-encode images (prevent malicious files)
   - Remove EXIF data
   - Generate thumbnails
   - Virus scan (optional)
```

### 4. API Security
```
✅ HTTPS/TLS
   - SSL/TLS encryption (all traffic)
   - Certificate: Let's Encrypt

✅ CORS
   - Whitelist allowed origins
   - Explicit method restrictions
   - Credentials: secure

✅ API Keys
   - If needed: Hashed, rotatable keys
   - Rate limiting per key

✅ Headers
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Strict-Transport-Security: max-age=31536000
   - Content-Security-Policy: default-src 'self'
   - Referrer-Policy: strict-origin-when-cross-origin
```

### 5. Database Security
```
✅ Encryption
   - At-rest: Database-level encryption
   - In-transit: TLS connection

✅ Access Control
   - Principle of Least Privilege
   - User permissions per role
   - Separate read-write accounts

✅ Backups
   - Daily automated backups
   - Off-site backup storage
   - Restore testing

✅ Audit Trail
   - All admin actions logged
   - IP address recorded
   - Timestamp & user tracking
```

### 6. Admin Panel Security
```
✅ Authentication
   - 2FA support (optional)
   - Login attempt logging
   - Suspicious activity detection

✅ Authorization
   - Role-Based Access Control (RBAC)
   - Admin: Full access
   - Editor: Content management
   - Viewer: Read-only

✅ Audit Logging
   - All changes tracked
   - Before/after values
   - Admin & IP logged
   - Deletion soft-delete option
```

---

## 🎨 Frontend Blueprint (Antigravity)

### Taslak: Public Menu Page (Müşteri Tarafı)

```html
<!-- ANTIGRAVITY'DE OLUŞTURULACAK -->

<!-- Header / Navigation (Mobile & Desktop)  -->
<header class="header-section">
  <!-- Dinamik: GET /api/v1/layout/:deviceType/header -->
  <div class="header-content">
    <div class="logo-section">
      <img src="/logo.png" alt="Yedideğirmenler" />
      <h1>Yedideğirmenler Tabiat Parkı</h1>
      <p>Kafe & Restorant</p>
    </div>
    
    <!-- Language Switcher -->
    <div class="language-switcher">
      <button data-lang="tr">Türkçe</button>
      <button data-lang="en">English</button>
      <button data-lang="ar">العربية</button>
    </div>
  </div>
</header>

<!-- Main Content -->
<main class="menu-container">
  
  <!-- Categories (Tab Style) -->
  <section class="categories-section">
    <!-- API: GET /api/v1/categories -->
    <div class="category-tabs">
      <button class="category-tab active" data-category-id="1">
        <i class="fi fi-rr-utensils"></i>
        <span>Kahvaltı</span>
      </button>
      <button class="category-tab" data-category-id="2">
        <i class="fi fi-rr-flame"></i>
        <span>Ana Yemekler</span>
      </button>
      <!-- ... -->
    </div>
  </section>
  
  <!-- Products Grid -->
  <section class="products-section">
    <!-- API: GET /api/v1/categories/:slug/products -->
    <div class="products-grid">
      
      <!-- Product Card -->
      <article class="product-card">
        <figure class="product-image">
          <img src="/uploads/products/menemen.jpg" alt="Menemen" />
          <figcaption>Menemen</figcaption>
        </figure>
        
        <div class="product-info">
          <h3>Menemen</h3>
          <p class="description">Domates, biber ve yumurta</p>
          
          <!-- Allergen Icons (Flaticon) -->
          <div class="allergens-section">
            <span class="allergen-badge" title="Yumurta">
              <i class="fi fi-rr-egg"></i>
            </span>
            <span class="allergen-badge" title="Süt">
              <i class="fi fi-rr-milk"></i>
            </span>
          </div>
          
          <!-- Nutrition Info (Toggle) -->
          <details class="nutrition-info">
            <summary>Beslensel Bilgi</summary>
            <ul>
              <li>Kalori: 320 kcal</li>
              <li>Protein: 12g</li>
              <li>Yağ: 18g</li>
              <li>Karbohidrat: 25g</li>
            </ul>
          </details>
          
          <div class="product-footer">
            <span class="price">45 ₺</span>
            <button class="details-btn">Detaylar</button>
          </div>
        </div>
      </article>
      
      <!-- More product cards... -->
    </div>
  </section>

</main>

<!-- Footer (Mobile & Desktop) -->
<footer class="footer-section">
  <!-- Dinamik: GET /api/v1/layout/:deviceType/footer -->
  <div class="footer-content">
    <div class="contact-info">
      <h4>İletişim</h4>
      <p>📞 <a href="tel:+904561234567">+90 456 123 45 67</a></p>
      <p>📧 <a href="mailto:info@yedidegirmenler.com">info@yedidegirmenler.com</a></p>
      <p>📍 Karadeniz Bölgesi, Tabiat Parkı</p>
    </div>
    
    <div class="hours-info">
      <h4>Çalışma Saatleri</h4>
      <p>Her Gün: 08:00 - 23:00</p>
    </div>
  </div>
</footer>

<!-- JavaScript Uygulanacaklar -->
<script>
  // 1. API'den veri çek (fetch/axios)
  // 2. Language seçimine göre API'den çeviriyi çek
  // 3. Dinamik HTML oluştur
  // 4. Event listeners ekle
  // 5. Flaticon ikonları load et
  // 6. Google Translate API entegrasyonu (opsiyonel)
  // 7. Interaktif animasyonlar (Framer Motion / GSAP)
</script>
```

### Taslak: Admin Panel (Dashboard)

```html
<!-- ANTIGRAVITY'DE OLUŞTURULACAK -->

<!-- Admin Header -->
<header class="admin-header">
  <div class="admin-branding">
    <h1>🏞️ Yedideğirmenler Admin</h1>
  </div>
  <div class="admin-user">
    <span>Hoşgeldin, Admin</span>
    <button class="logout-btn">Çıkış Yap</button>
  </div>
</header>

<!-- Sidebar Navigation -->
<aside class="admin-sidebar">
  <nav>
    <a href="#/dashboard" class="nav-link active">
      <i class="fi fi-rr-chart-bar"></i> Dashboard
    </a>
    <a href="#/site-settings" class="nav-link">
      <i class="fi fi-rr-settings"></i> Site Ayarları
    </a>
    <a href="#/categories" class="nav-link">
      <i class="fi fi-rr-list"></i> Kategoriler
    </a>
    <a href="#/products" class="nav-link">
      <i class="fi fi-rr-utensils"></i> Ürünler
    </a>
    <a href="#/allergens" class="nav-link">
      <i class="fi fi-rr-info"></i> Alerjenler
    </a>
    <a href="#/layout" class="nav-link">
      <i class="fi fi-rr-layout"></i> Layout (Mobil/Masaüstü)
    </a>
    <a href="#/translations" class="nav-link">
      <i class="fi fi-rr-language"></i> Çeviriler
    </a>
    <a href="#/audit-logs" class="nav-link">
      <i class="fi fi-rr-history"></i> İşlem Kayıtları
    </a>
  </nav>
</aside>

<!-- Main Content Area -->
<main class="admin-content">
  
  <!-- SITE SETTINGS PAGE -->
  <section id="site-settings" class="admin-section">
    <h2>Site Ayarları</h2>
    
    <form class="settings-form">
      <!-- Title & Subtitle -->
      <fieldset class="form-group">
        <legend>Genel Bilgiler</legend>
        
        <div class="form-field">
          <label for="site-title">Site Başlığı</label>
          <input type="text" id="site-title" name="site_title" placeholder="Yedideğirmenler Tabiat Parkı" />
        </div>
        
        <div class="form-field">
          <label for="site-subtitle">Site Alt Başlığı</label>
          <input type="text" id="site-subtitle" name="site_subtitle" placeholder="Kafe & Restorant" />
        </div>
        
        <div class="form-field">
          <label for="site-description">Site Açıklaması</label>
          <textarea id="site-description" name="site_description" rows="4"></textarea>
        </div>
      </fieldset>
      
      <!-- Contact Info -->
      <fieldset class="form-group">
        <legend>İletişim Bilgileri</legend>
        
        <div class="form-field">
          <label for="phone">Telefon</label>
          <input type="tel" id="phone" name="phone" placeholder="+90 456 123 45 67" />
        </div>
        
        <div class="form-field">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" placeholder="info@yedidegirmenler.com" />
        </div>
        
        <div class="form-field">
          <label for="address">Adres</label>
          <input type="text" id="address" name="address" placeholder="Karadeniz Bölgesi, Tabiat Parkı" />
        </div>
        
        <div class="form-field">
          <label for="business-hours">Çalışma Saatleri</label>
          <input type="text" id="business-hours" name="business_hours" placeholder="Her Gün: 08:00 - 23:00" />
        </div>
      </fieldset>
      
      <button type="submit" class="btn btn-primary">Kaydet</button>
    </form>
  </section>
  
  <!-- CATEGORIES MANAGEMENT PAGE -->
  <section id="categories" class="admin-section">
    <h2>Kategoriler</h2>
    
    <button class="btn btn-success">+ Yeni Kategori</button>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>İkon</th>
          <th>Adı</th>
          <th>Renk</th>
          <th>Sıra</th>
          <th>Durum</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <!-- API'den dinamik olarak doldurulacak -->
        <tr>
          <td><i class="fi fi-rr-utensils"></i></td>
          <td>Kahvaltı</td>
          <td><span class="color-preview" style="background-color: #d4a574;"></span></td>
          <td>1</td>
          <td><span class="status-active">Aktif</span></td>
          <td>
            <button class="btn btn-sm btn-secondary">Düzenle</button>
            <button class="btn btn-sm btn-danger">Sil</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  
  <!-- PRODUCTS MANAGEMENT PAGE -->
  <section id="products" class="admin-section">
    <h2>Ürünler</h2>
    
    <button class="btn btn-success">+ Yeni Ürün Ekle</button>
    
    <!-- Product Form (Modal/Inline) -->
    <form class="product-form">
      <fieldset>
        <legend>Ürün Bilgileri</legend>
        
        <div class="form-field">
          <label for="product-category">Kategori</label>
          <select id="product-category" name="category_id">
            <!-- API'den dinamik -->
            <option value="1">Kahvaltı</option>
            <option value="2">Ana Yemekler</option>
          </select>
        </div>
        
        <div class="form-field">
          <label for="product-name">Ürün Adı</label>
          <input type="text" id="product-name" name="name" placeholder="Menemen" />
        </div>
        
        <div class="form-field">
          <label for="product-description">Kısa Açıklama</label>
          <textarea id="product-description" name="description" rows="3" placeholder="Domates, biber ve yumurta"></textarea>
        </div>
        
        <div class="form-field">
          <label for="product-content">Detaylı Açıklama</label>
          <textarea id="product-content" name="detailed_content" rows="5" placeholder="Uzun açıklama..."></textarea>
        </div>
        
        <div class="form-group">
          <legend>Fiyat Bilgileri</legend>
          
          <div class="form-row">
            <div class="form-field">
              <label for="product-price">Fiyat (₺)</label>
              <input type="number" id="product-price" name="price" step="0.01" placeholder="45" />
            </div>
            
            <div class="form-field">
              <label for="product-discount">İndirimli Fiyat (₺)</label>
              <input type="number" id="product-discount" name="discount_price" step="0.01" placeholder="40" />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <legend>Beslensel Bilgiler</legend>
          
          <div class="form-row">
            <div class="form-field">
              <label for="product-calories">Kalori (kcal)</label>
              <input type="number" id="product-calories" name="calories" placeholder="320" />
            </div>
            
            <div class="form-field">
              <label for="product-protein">Protein (g)</label>
              <input type="number" id="product-protein" name="protein" step="0.1" placeholder="12" />
            </div>
            
            <div class="form-field">
              <label for="product-fat">Yağ (g)</label>
              <input type="number" id="product-fat" name="fat" step="0.1" placeholder="18" />
            </div>
            
            <div class="form-field">
              <label for="product-carbs">Karbohidrat (g)</label>
              <input type="number" id="product-carbs" name="carbs" step="0.1" placeholder="25" />
            </div>
          </div>
        </div>
        
        <!-- ALERJENLER -->
        <div class="form-group">
          <legend>Alerjenler</legend>
          
          <div class="allergen-checkboxes">
            <!-- API'den dinamik olarak doldurulacak -->
            <label class="checkbox-label">
              <input type="checkbox" name="allergens" value="1" />
              <i class="fi fi-rr-egg"></i> Yumurta
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" name="allergens" value="2" />
              <i class="fi fi-rr-milk"></i> Süt
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" name="allergens" value="3" />
              <i class="fi fi-rr-bread"></i> Gluten
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" name="allergens" value="4" />
              <i class="fi fi-rr-nut"></i> Ağaç Fındık
            </label>
            
            <!-- ... more allergens ... -->
          </div>
        </div>
        
        <!-- IMAGE UPLOAD -->
        <div class="form-field">
          <label for="product-image">Ürün Görseli</label>
          <div class="image-upload-area">
            <input type="file" id="product-image" name="image" accept="image/*" />
            <button type="button" class="btn btn-secondary">Görseli Seç</button>
          </div>
          <div id="image-preview" class="image-preview"></div>
        </div>
        
        <div class="form-row">
          <div class="form-field">
            <label for="product-serving">Porsiyon (gr)</label>
            <input type="text" id="product-serving" name="serving_size" placeholder="250gr" />
          </div>
          
          <div class="form-field">
            <label for="product-time">Hazırlama Süresi (dk)</label>
            <input type="number" id="product-time" name="preparation_time" placeholder="15" />
          </div>
        </div>
        
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name="is_featured" />
            Öne Çıkan Ürün
          </label>
        </div>
        
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name="is_available" checked />
            Mevcuttur
          </label>
        </div>
      </fieldset>
      
      <button type="submit" class="btn btn-primary">Kaydet</button>
    </form>
  </section>
  
  <!-- LAYOUT SETTINGS (Header/Footer - Mobile/Desktop) -->
  <section id="layout" class="admin-section">
    <h2>Layout Ayarları (Header & Footer)</h2>
    
    <div class="layout-tabs">
      <!-- Mobile Header -->
      <div class="tab-content" data-device="mobile" data-section="header">
        <h3>Mobil Header</h3>
        
        <form class="layout-form">
          <div class="form-field">
            <label for="mobile-header-logo">Logo Görseli</label>
            <input type="file" name="logo_url" accept="image/*" />
          </div>
          
          <div class="form-field">
            <label for="mobile-header-bg">Arka Plan Rengi</label>
            <input type="color" name="background_color" value="#1a3a2a" />
          </div>
          
          <div class="form-field">
            <label class="checkbox-label">
              <input type="checkbox" name="show_logo" checked />
              Logo Göster
            </label>
          </div>
          
          <div class="form-field">
            <label class="checkbox-label">
              <input type="checkbox" name="show_title" checked />
              Başlık Göster
            </label>
          </div>
          
          <div class="form-field">
            <label class="checkbox-label">
              <input type="checkbox" name="show_language_switcher" checked />
              Dil Seçici Göster
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary">Kaydet</button>
        </form>
      </div>
      
      <!-- Mobile Footer -->
      <div class="tab-content" data-device="mobile" data-section="footer">
        <h3>Mobil Footer</h3>
        <!-- Benzer form ... -->
      </div>
      
      <!-- Desktop Header -->
      <div class="tab-content" data-device="desktop" data-section="header">
        <h3>Masaüstü Header</h3>
        <!-- Benzer form ... -->
      </div>
      
      <!-- Desktop Footer -->
      <div class="tab-content" data-device="desktop" data-section="footer">
        <h3>Masaüstü Footer</h3>
        <!-- Benzer form ... -->
      </div>
    </div>
  </section>
  
  <!-- ALLERGENS MANAGEMENT -->
  <section id="allergens" class="admin-section">
    <h2>Alerjen Türleri</h2>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>İkon</th>
          <th>Kod</th>
          <th>Adı</th>
          <th>Açıklama</th>
          <th>Durum</th>
        </tr>
      </thead>
      <tbody>
        <!-- API'den dinamik -->
      </tbody>
    </table>
  </section>
  
  <!-- TRANSLATIONS MANAGEMENT -->
  <section id="translations" class="admin-section">
    <h2>Çeviriler</h2>
    
    <form class="translation-form">
      <div class="form-field">
        <label for="trans-language">Dil</label>
        <select id="trans-language">
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      
      <div class="form-field">
        <label for="trans-entity">Entity Türü</label>
        <select id="trans-entity">
          <option value="category">Kategori</option>
          <option value="product">Ürün</option>
          <option value="setting">Ayar</option>
        </select>
      </div>
      
      <div class="form-field">
        <label for="trans-content">Çeviri Metni</label>
        <textarea id="trans-content" rows="4"></textarea>
      </div>
      
      <button type="submit" class="btn btn-primary">Kaydet</button>
    </form>
  </section>
  
  <!-- AUDIT LOGS -->
  <section id="audit-logs" class="admin-section">
    <h2>İşlem Kayıtları</h2>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>Tarih & Saat</th>
          <th>Admin</th>
          <th>İşlem</th>
          <th>Entity Türü</th>
          <th>Eski Değer</th>
          <th>Yeni Değer</th>
          <th>IP Adresi</th>
        </tr>
      </thead>
      <tbody>
        <!-- API'den dinamik -->
      </tbody>
    </table>
  </section>

</main>
```

---

## 👤 Admin Panel Requirements

### Sayfa Hiyerarşisi

```
┌─ Dashboard
│  ├─ Quick Stats (Toplam ürün, kategori, ziyaretçi, etc.)
│  ├─ Recent Logs
│  └─ Quick Links
│
├─ Site Settings
│  ├─ General Info (Title, Subtitle, Description)
│  ├─ Contact Info (Phone, Email, Address)
│  ├─ Business Hours
│  └─ Meta Tags (SEO)
│
├─ Categories
│  ├─ List (Tablo)
│  │  ├─ Edit
│  │  ├─ Delete (Soft Delete)
│  │  └─ Toggle Active/Inactive
│  └─ Add New
│     ├─ Name (required, unique slug auto-generate)
│     ├─ Description
│     ├─ Icon (Flaticon selector)
│     ├─ Color (Color picker)
│     └─ Sort Order
│
├─ Products
│  ├─ List (Tablo)
│  │  ├─ Filter by Category
│  │  ├─ Search
│  │  ├─ Bulk Actions (Delete, Disable, etc.)
│  │  ├─ Edit
│  │  └─ Delete
│  └─ Add New / Edit
│     ├─ Category (dropdown)
│     ├─ Name (required)
│     ├─ Description
│     ├─ Detailed Content (WYSIWYG Editor)
│     ├─ Price & Discount
│     ├─ Image Upload
│     ├─ Nutrition Info (Calories, Protein, Fat, Carbs)
│     ├─ Preparation Time
│     ├─ Serving Size
│     ├─ Allergens (Multi-select with checkboxes)
│     ├─ Status (Available/Not Available)
│     ├─ Featured (Toggle)
│     └─ Sort Order
│
├─ Allergens
│  ├─ List (Predefined)
│  └─ View/Edit (Kod, Adı, İkon, Açıklama)
│
├─ Layout Settings
│  ├─ Mobile Header
│  │  ├─ Logo URL
│  │  ├─ Background Color
│  │  ├─ Show/Hide Elements
│  │  └─ Menu Items
│  ├─ Mobile Footer
│  │  └─ Similar to Header
│  ├─ Desktop Header
│  │  └─ Similar to Mobile
│  └─ Desktop Footer
│     └─ Similar to Mobile
│
├─ Translations
│  ├─ Select Language (EN, AR)
│  ├─ Select Entity (Category, Product, Setting)
│  ├─ Enter Original & Translation
│  └─ Save
│
├─ Audit Logs
│  ├─ Filter by Date, Admin, Action, Entity Type
│  ├─ View Action Details (Before/After values)
│  └─ Export to CSV
│
└─ User Account
   ├─ Profile
   ├─ Change Password
   └─ Logout
```

### Form Validation Rules

```
Categories:
  - name: required, min 3, max 100, unique
  - description: max 500
  - icon: required
  - color: required, valid hex color
  - sort_order: integer

Products:
  - category_id: required, exists in categories
  - name: required, min 3, max 100, unique per category
  - description: required, min 10, max 500
  - detailed_content: max 5000
  - price: required, decimal, > 0
  - discount_price: optional, decimal, < price
  - image: optional, file type: jpg|png|gif|webp, size < 5MB
  - calories: integer, >= 0
  - protein, fat, carbs: decimal, >= 0
  - preparation_time: integer, >= 0
  - serving_size: max 50
  - allergens: array of valid allergen IDs

Settings:
  - site_title: required, max 100
  - phone: valid phone format
  - email: valid email
  - address: max 200
  - business_hours: max 100
```

---

## 🌐 Dil & İçerik Sistemi

### Multi-Language Implementation

```
┌─ Default Language
│  └─ Turkish (TR)
│
├─ English (EN)
│  ├─ Auto-translate via Google Translate API
│  └─ Manual override possible
│
└─ Arabic (AR)
   ├─ Auto-translate via Google Translate API
   └─ Manual override possible

API Endpoint: /api/v1/products?lang=en
```

### Google Translate Integration

```javascript
// Frontend: Google Translate API Integration

// Option 1: GTranslate Widget (Client-side)
<script>
  window.gtranslateConfig = {
    default_language: 'tr',
    languages: ['tr', 'en', 'ar'],
    wrapper_selector: '.menu-container'
  }
</script>
<script src="https://cdn.gtranslate.net/widgets/latest/gt.js"></script>

// Option 2: Backend Translation (Server-side)
// - Store translations in database
// - API returns localized content based on lang parameter
// - Admin can override auto-translations
```

---

## 🚀 Deployment Guide

### Prerequisites
```
- Node.js 18+ (if using Node.js)
- MySQL 8.0+ / MariaDB 10.6+
- Docker & Docker Compose (optional)
- Nginx (reverse proxy)
- Let's Encrypt (SSL/TLS)
```

### Docker Deployment

```dockerfile
# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml

version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://user:password@db:3306/qr_menu
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - db
    networks:
      - qr-menu-network

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: qr_menu
      MYSQL_USER: qr_user
      MYSQL_PASSWORD: qr_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./database.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - qr_menu-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - qr_menu-network

volumes:
  db_data:

networks:
  qr_menu-network:
    driver: bridge
```

### Nginx Configuration

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location ~ ^/uploads/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## ✅ Test & QA Checklist

### Functional Testing

```
☐ Public Menu Page
  ☐ Categories load correctly
  ☐ Products display properly
  ☐ Allergen icons show
  ☐ Language switcher works
  ☐ Responsive on mobile/tablet/desktop
  ☐ Product details modal opens

☐ Admin Authentication
  ☐ Login with valid credentials
  ☐ Login fails with invalid credentials
  ☐ Password change works
  ☐ Session timeout
  ☐ Logout clears session

☐ Admin Panel
  ☐ Site settings save correctly
  ☐ Categories CRUD works
  ☐ Products CRUD works
  ☐ Image upload works
  ☐ Allergen assignment works
  ☐ Layout settings apply
  ☐ Translations save

☐ API Endpoints
  ☐ All endpoints return correct data
  ☐ Pagination works
  ☐ Filtering works
  ☐ Error handling works
  ☐ Rate limiting works
```

### Security Testing

```
☐ SQL Injection Prevention
  ☐ Test with malicious input
  ☐ Parameterized queries used
  ☐ No raw SQL concatenation

☐ XSS Prevention
  ☐ HTML escaping works
  ☐ CSP headers present
  ☐ No script injection possible

☐ CSRF Protection
  ☐ CSRF tokens validated
  ☐ SameSite cookies set
  ☐ Origin verification

☐ Authentication
  ☐ JWT tokens secure
  ☐ Password hashing secure
  ☐ Session hijacking protection

☐ File Upload
  ☐ File type validation
  ☐ File size limits
  ☐ No executable files uploaded

☐ API Security
  ☐ HTTPS enforced
  ☐ CORS properly configured
  ☐ Rate limiting works
  ☐ Authentication required for admin
```

### Performance Testing

```
☐ Load Time
  ☐ Homepage loads < 3s
  ☐ Admin panel loads < 2s
  ☐ API responses < 500ms

☐ Scalability
  ☐ Handle 1000 concurrent users
  ☐ Database queries optimized
  ☐ Caching works

☐ Mobile Performance
  ☐ Lighthouse score > 80
  ☐ First Contentful Paint < 1.8s
  ☐ Cumulative Layout Shift < 0.1
```

---

## 📞 Support & Documentation

### API Documentation
- Swagger UI: `/api/docs`
- OpenAPI spec: `/api/openapi.json`

### Development Guide
- Frontend setup: `FRONTEND_SETUP.md`
- Backend setup: `BACKEND_SETUP.md`
- Database setup: `DATABASE_SETUP.md`

### Troubleshooting
- Common issues: `TROUBLESHOOTING.md`
- FAQ: `FAQ.md`

---

## 📝 Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0.0   | 2024       | Initial specification document   |

---

**Document Status:** ✅ Ready for Development

**Last Updated:** 2024

**Prepared for:** Yedideğirmenler Tabiat Parkı & Kafe Restorant