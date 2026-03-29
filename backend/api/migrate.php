<?php
// backend/api/migrate.php
require_once 'core/Database.php';
require_once 'config/config.php';

use Core\Database;

$db = Database::getInstance();
echo "🚀 Veritabanı güncellemesi başlatılıyor...\n";

$updateQueries = [
    // Categories updates
    "ALTER TABLE categories ADD COLUMN created_by INTEGER",
    "ALTER TABLE categories ADD COLUMN image VARCHAR(255)",
    "ALTER TABLE categories ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP",

    // Products updates
    "ALTER TABLE products ADD COLUMN detailed_content TEXT",
    "ALTER TABLE products ADD COLUMN created_by INTEGER",
    "ALTER TABLE products ADD COLUMN out_of_stock_text TEXT",
    "ALTER TABLE products ADD COLUMN detailed_images TEXT",
    "ALTER TABLE products ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP",
];

foreach ($updateQueries as $sql) {
    try {
        $db->execute($sql);
        echo "✅ Başarılı: $sql\n";
    } catch (\Exception $e) {
        echo "ℹ️ Bilgi: $sql (Zaten eklenmiş olabilir veya hata: " . $e->getMessage() . ")\n";
    }
}

echo "\n🏁 Güncelleme tamamlandı.\n";
