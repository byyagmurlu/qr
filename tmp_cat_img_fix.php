<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();

// Add 'image' column to categories if not exists
$columns = $db->fetchAll("PRAGMA table_info(categories)");
$hasImage = false;
foreach ($columns as $col) {
    if ($col['name'] === 'image') {
        $hasImage = true;
        break;
    }
}

if (!$hasImage) {
    $db->execute("ALTER TABLE categories ADD COLUMN image TEXT");
}

echo "Categories table updated with image column!\n";
