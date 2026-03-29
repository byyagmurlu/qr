<?php
// backend/api/seeds/Seeder.php
// SQLite + MySQL compatible Seeder using Core\Database
// Run: php seeds/Seeder.php

require_once dirname(__DIR__) . '/core/Database.php';

use Core\Database;

spl_autoload_register(function ($class) {
    if (strpos($class, 'Core\\') === 0) return; // Database loaded manually
});

$db = Database::getInstance();
$driver = $db->getDriver();

echo "🌱 Seeder başlatılıyor...\n";
echo "📦 Driver: " . $driver . "\n\n";

// ═══════════════════════════════════════════════
// SCHEMA — Tabloları oluştur (yoksa)
// ═══════════════════════════════════════════════
echo "📐 Tablolar oluşturuluyor...\n";

// Table schema strings
$tables = [
    "admin_users" => "
        CREATE TABLE IF NOT EXISTS admin_users (
            id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
            username      VARCHAR(50) NOT NULL UNIQUE,
            email         VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            salt          VARCHAR(32) NOT NULL DEFAULT '',
            full_name     VARCHAR(100),
            role          VARCHAR(10) NOT NULL DEFAULT 'editor',
            is_active     TINYINT NOT NULL DEFAULT 1,
            last_login    DATETIME,
            login_attempts TINYINT NOT NULL DEFAULT 0,
            locked_until  DATETIME,
            created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )",
    "site_settings" => "
        CREATE TABLE IF NOT EXISTS site_settings (
            id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
            setting_key   VARCHAR(50) NOT NULL UNIQUE,
            setting_value TEXT,
            setting_type  VARCHAR(10) NOT NULL DEFAULT 'text',
            description   TEXT,
            is_editable   TINYINT NOT NULL DEFAULT 1,
            created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by    INTEGER
        )",
    // ... all other tables (Simplified for SQLite/MySQL cross)
];

// Re-running full SQL block for SQLite/MySQL basic types:
$schemaSql = "
CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    username      VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt          VARCHAR(100) NOT NULL DEFAULT '',
    full_name     VARCHAR(100),
    role          VARCHAR(20) NOT NULL DEFAULT 'admin',
    is_active     INTEGER NOT NULL DEFAULT 1,
    last_login    TEXT,
    login_attempts INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    setting_key   VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type  VARCHAR(20) DEFAULT 'text',
    is_editable   INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categories (
    id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    description   TEXT,
    icon_code     VARCHAR(50),
    color_code    VARCHAR(20) DEFAULT '#2d5016',
    sort_order    INTEGER DEFAULT 0,
    is_active     INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
    id               INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    category_id      INTEGER NOT NULL,
    name             VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL UNIQUE,
    description      TEXT,
    price            DOUBLE NOT NULL,
    discount_price   DOUBLE,
    is_available     INTEGER DEFAULT 1,
    is_featured      INTEGER DEFAULT 0,
    image_path       VARCHAR(255),
    preparation_time INTEGER,
    serving_size     VARCHAR(100),
    calories         INTEGER,
    protein          DOUBLE,
    fat              DOUBLE,
    carbs            DOUBLE,
    sort_order       INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS allergen_types (
    id          INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon_code   VARCHAR(50),
    sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS languages (
    id          INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    code        VARCHAR(5) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    is_active   INTEGER DEFAULT 1,
    is_default  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS translations (
    id            INTEGER PRIMARY KEY " . ($driver === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT') . ",
    language_code VARCHAR(5) NOT NULL,
    entity_type   VARCHAR(20) NOT NULL,
    entity_id     INTEGER NOT NULL,
    field_name    VARCHAR(50) NOT NULL,
    translation_text TEXT NOT NULL
);
";

// Execute schema
// Split execute as Multi-query with PDO is tricky, better line by line or one by one
$queries = explode(";", $schemaSql);
foreach($queries as $q) {
    $q = trim($q);
    if ($q) $db->execute($q);
}

echo "✅ Tablolar hazır\n\n";

// ═══════════════════════════════════════════════
// 1. ADMIN USER
// ═══════════════════════════════════════════════
$hash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
$count = $db->fetchOne("SELECT COUNT(*) as total FROM admin_users WHERE username = ?", ['admin'])['total'];
if ($count == 0) {
    $db->execute("INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
        ['admin', 'admin@yedidegirmenler.com', $hash, 'Sistem Yöneticisi', 'admin']);
    echo "✅ Admin kullanıcı created: admin / admin123\n";
} else {
    echo "ℹ️ Admin user already exists.\n";
}

// ═══════════════════════════════════════════════
// 2. KATEGORİLER
// ═══════════════════════════════════════════════
$categories = [
    ['Kahvaltı',       'kahvalti',       'fi-rr-sunrise',    '#d4a574', 1],
    ['Ana Yemekler',   'ana-yemekler',   'fi-rr-restaurant', '#2d5016', 2],
    ['Çorbalar',       'corbalar',        'fi-rr-soup',       '#1e5a7a', 3],
    ['Izgara & Kebap', 'izgara-kebap',   'fi-rr-grill',      '#8b1a1a', 4],
    ['Salatalar',      'salatalar',      'fi-rr-salad',      '#3a7a2d', 5],
    ['Tatlılar',       'tatlilar',       'fi-rr-candy',      '#c0687a', 6],
    ['Yöresel',        'yoresel-lezzetler','fi-rr-leaf',       '#4a7a2a', 7],
];

foreach ($categories as [$name, $slug, $icon, $color, $order]) {
    $check = $db->fetchOne("SELECT id FROM categories WHERE slug = ?", [$slug]);
    if (!$check) {
        $db->execute("INSERT INTO categories (name, slug, icon_code, color_code, sort_order) VALUES (?, ?, ?, ?, ?)",
            [$name, $slug, $icon, $color, $order]);
    }
}
echo "✅ Kategoriler eklendi.\n";

// Kategori Map
$cats = [];
foreach ($db->fetchAll("SELECT id, slug FROM categories") as $r) $cats[$r['slug']] = $r['id'];

// ═══════════════════════════════════════════════
// 3. ÜRÜNLER
// ═══════════════════════════════════════════════
$products = [
    ['serpme-kahvalti',  'kahvalti', 'Serpme Kahvaltı', 'Doğal köy kahvaltısı (2 Kişilik)', 180.0, 15, '2 Kişilik', 1],
    ['menemen',          'kahvalti', 'Menemen',         'Taze domates ve köy yumurtası',    65.0, 10, '1 Kişilik', 2],
    ['dugun-corbasi',    'corbalar', 'Düğün Çorbası',   'Geleneksel yoğurtlu etli çorba',   70.0, 10, '450 ml',    1],
    ['mercimek-corbasi', 'corbalar', 'Mercimek Çorbası','Sıcak tereyağlı',                 55.0, 10, '400 ml',    2],
    ['muhlama',          'yoresel-lezzetler', 'Muhlama', 'Mıhlama (Kuymak)',                 90.0, 15, '300 gr',    1],
    ['tavuk-izgara',     'izgara-kebap', 'Tavuk Izgara', 'Özel sosu ile',                   105.0, 18, '250 gr',    2],
];

foreach ($products as [$slug, $catSlug, $name, $desc, $price, $prep, $serv, $order]) {
    $catId = $cats[$catSlug] ?? null;
    if (!$catId) continue;
    $check = $db->fetchOne("SELECT id FROM products WHERE slug = ?", [$slug]);
    if (!$check) {
        $db->execute("INSERT INTO products (category_id, name, slug, description, price, preparation_time, serving_size, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$catId, $name, $slug, $desc, $price, $prep, $serv, $order]);
    }
}
echo "✅ Ürünler eklendi.\n";

// ═══════════════════════════════════════════════
// 4. ALERJENLER
// ═══════════════════════════════════════════════
$allergens = [
    ['gluten', 'Gluten', 'wheat', 1],
    ['milk',   'Süt',   'milk',  2],
    ['eggs',   'Yumurta','egg',   3],
];
foreach ($allergens as [$code, $name, $icon, $order]) {
    $check = $db->fetchOne("SELECT id FROM allergen_types WHERE code = ?", [$code]);
    if (!$check) {
        $db->execute("INSERT INTO allergen_types (code, name, icon_code, sort_order) VALUES (?, ?, ?, ?)",
            [$code, $name, $icon, $order]);
    }
}
echo "✅ Alerjenler eklendi.\n";

// ═══════════════════════════════════════════════
// 5. AYARLAR
// ═══════════════════════════════════════════════
$settings = [
    ['site_title',    'Yedideğirmenler'],
    ['site_subtitle', 'Kafe & Restorant'],
    ['phone',         '+90 462 000 00 00'],
];
foreach ($settings as [$key, $val]) {
    $check = $db->fetchOne("SELECT id FROM site_settings WHERE setting_key = ?", [$key]);
    if (!$check) {
        $db->execute("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)", [$key, $val]);
    }
}
echo "✅ Ayarlar eklendi.\n";
// ═══════════════════════════════════════════════
// 6. DİLLER
// ═══════════════════════════════════════════════
$langs = [
    ['tr', 'Türkçe', 1],
    ['en', 'English', 0],
    ['ar', 'العربية', 0]
];
foreach($langs as [$code, $name, $def]) {
    $check = $db->fetchOne("SELECT id FROM languages WHERE code = ?", [$code]);
    if(!$check) $db->execute("INSERT INTO languages (code, name, is_default) VALUES (?,?,?)", [$code, $name, $def]);
}
echo "✅ Diller eklendi.\n";

echo "\n🚀 İşlem tamam! Giriş: admin / admin123\n";
