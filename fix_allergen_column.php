<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
try {
    $db->execute("ALTER TABLE allergen_types ADD COLUMN description TEXT");
    echo "Column 'description' added to allergen_types.\n";
} catch (Exception $e) {
    echo "Error or already exists: " . $e->getMessage() . "\n";
}
