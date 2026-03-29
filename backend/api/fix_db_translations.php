<?php
// backend/api/fix_db_translations.php
require_once 'core/Database.php';
require_once 'config/config.php';
use Core\Database;

$db = Database::getInstance();

try {
    echo "Creating backup of translations...\n";
    $db->execute("CREATE TABLE translations_old AS SELECT * FROM translations");
    
    echo "Dropping and recreating translations table with UNIQUE constraint...\n";
    $db->execute("DROP TABLE translations");
    $db->execute("CREATE TABLE translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language_code VARCHAR(5) NOT NULL,
        entity_type VARCHAR(20) NOT NULL,
        entity_id INTEGER NOT NULL,
        field_name VARCHAR(50) NOT NULL,
        translation_text TEXT NOT NULL,
        UNIQUE(language_code, entity_type, entity_id, field_name)
    )");

    echo "Restoring data (ignoring duplicates)...\n";
    $db->execute("INSERT OR IGNORE INTO translations (language_code, entity_type, entity_id, field_name, translation_text)
                  SELECT language_code, entity_type, entity_id, field_name, translation_text FROM translations_old");

    echo "Database fixed successfully!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
