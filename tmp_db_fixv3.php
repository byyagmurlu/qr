<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();

function addCol($db, $table, $col, $def) {
    try {
        $db->execute("ALTER TABLE $table ADD COLUMN $col $def");
        echo "✅ Added $col\n";
    } catch (Exception $e) {
        echo "❌ Skip $col: " . $e->getMessage() . "\n";
    }
}

addCol($db, 'site_settings', 'created_at', 'TEXT');
addCol($db, 'site_settings', 'updated_at', 'TEXT');

// Verify
$res = $db->fetchAll("PRAGMA table_info(site_settings)");
echo "Final Columns:\n";
foreach($res as $r) echo "- " . $r['name'] . "\n";
