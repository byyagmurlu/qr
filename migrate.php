<?php
// Add missing columns to admin_users table
require_once 'backend/api/config/config.php';
require_once 'backend/api/core/Database.php';

$db = Core\Database::getInstance();

$cols = $db->fetchAll("PRAGMA table_info(admin_users)");
$existing = array_column($cols, 'name');

$toAdd = [
    'login_attempts' => 'INTEGER NOT NULL DEFAULT 0',
    'locked_until'   => 'TEXT',
    'last_login'     => 'TEXT',
];

foreach ($toAdd as $col => $type) {
    if (!in_array($col, $existing)) {
        $db->execute("ALTER TABLE admin_users ADD COLUMN $col $type");
        echo "✅ Eklendi: $col\n";
    } else {
        echo "ℹ️ Zaten var: $col\n";
    }
}

echo "\nTamamlandı!\n";
