<?php
require_once 'backend/api/index.php'; // handles autoload and config

try {
    $db = \Core\Database::getInstance();
    $db->execute("ALTER TABLE categories ADD COLUMN created_by INTEGER DEFAULT NULL");
    echo "SUCCESS: created_by added to categories\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
