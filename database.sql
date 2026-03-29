-- Yedideğirmenler Tabiat Parkı QR Menü Sistemi - Database Schema
-- UTF-8 Encoding, Güvenlik ve Veri Bütünlüğü ile Tasarlanmış

-- Admin Kullanıcıları
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Ayarları
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    description VARCHAR(255),
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    INDEX idx_key (setting_key),
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kategoriler
CREATE TABLE IF NOT EXISTS categories (
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
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ürünler
CREATE TABLE IF NOT EXISTS products (
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
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alerjen Türleri
CREATE TABLE IF NOT EXISTS allergen_types (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ürün-Alerjen İlişkileri
CREATE TABLE IF NOT EXISTS product_allergens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    allergen_id INT NOT NULL,
    severity ENUM('trace', 'low', 'medium', 'high') DEFAULT 'trace',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergen_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_allergen (product_id, allergen_id),
    INDEX idx_product (product_id),
    INDEX idx_allergen (allergen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dil Çeviriler
CREATE TABLE IF NOT EXISTS translations (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Diller Tablosu
CREATE TABLE IF NOT EXISTS languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50),
    flag_icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    google_translate_code VARCHAR(10),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Başlık ve Footer Ayarları (Mobil/Masaüstü)
CREATE TABLE IF NOT EXISTS layout_settings (
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
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_device (device_type),
    INDEX idx_section (section_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin İşlem Kayıtları (Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
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
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at),
    INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Giriş Denemeleri (Brute Force Koruması)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    ip_address VARCHAR(45) NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    user_agent VARCHAR(255),
    INDEX idx_ip (ip_address),
    INDEX idx_time (attempt_time),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Alerjen Türleri Ekle
INSERT INTO allergen_types (code, name, icon_code, description, sort_order) VALUES
('gluten', 'Gluten', 'wheat', 'Buğday, arpa, çavdar içerir', 1),
('milk', 'Süt', 'milk', 'Süt ve süt ürünleri', 2),
('eggs', 'Yumurta', 'egg', 'Tavuk yumurtası', 3),
('peanuts', 'Yer Fıstığı', 'peanut', 'Yer fıstığı ve ürünleri', 4),
('nuts', 'Ağaç Fındık', 'nuts', 'Fındık, ceviz, antep fıstığı vb.', 5),
('fish', 'Balık', 'fish', 'Tüm balık türleri', 6),
('shellfish', 'Kabuklu Deniz Hayvanı', 'shrimp', 'İstakoz, karides, midye vb.', 7),
('soy', 'Soya', 'soy', 'Soya ve soya ürünleri', 8),
('sesame', 'Susam', 'sesame', 'Susam tohumları ve yağı', 9),
('sulfites', 'Sülfitler', 'wine', 'Koruma maddesi olarak kullanılan sülfitler', 10);

-- Default Diller Ekle
INSERT INTO languages (code, name, native_name, flag_icon, is_active, is_default, google_translate_code, sort_order) VALUES
('tr', 'Turkish', 'Türkçe', '🇹🇷', TRUE, TRUE, 'tr', 1),
('en', 'English', 'English', '🇬🇧', TRUE, FALSE, 'en', 2),
('ar', 'Arabic', 'العربية', '🇸🇦', TRUE, FALSE, 'ar', 3);

-- Default Site Ayarları
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_editable) VALUES
('site_title', 'Yedideğirmenler Tabiat Parkı', 'text', 'Site başlığı', TRUE),
('site_subtitle', 'Kafe & Restorant', 'text', 'Site alt başlığı', TRUE),
('site_description', 'Karadeniz\'in kalbinde doğal lezzetler', 'text', 'Site açıklaması', TRUE),
('phone', '+90 456 123 45 67', 'text', 'İletişim telefonu', TRUE),
('email', 'info@yedidegirmenler.com', 'text', 'İletişim e-maili', TRUE),
('address', 'Karadeniz Bölgesi, Tabiat Parkı', 'text', 'Fiziki adres', TRUE),
('business_hours', 'Her Gün: 08:00 - 23:00', 'text', 'İşletme saatleri', TRUE),
('meta_keywords', 'QR Menü, Restoran, Kafe, Karadeniz', 'text', 'Meta Keywords', TRUE),
('meta_description', 'Yedideğirmenler Tabiat Parkında doğal ve lezzetli yemekler', 'text', 'Meta Description', TRUE);

-- Karakterler ve Collation Uygunluğu
ALTER TABLE site_settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;