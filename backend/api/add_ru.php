<?php
// backend/api/add_ru.php
require_once 'core/Database.php';
require_once 'config/config.php';

use Core\Database;

$db = Database::getInstance();
$db->execute("INSERT OR IGNORE INTO languages (code, name, is_active, is_default) VALUES (?, ?, 1, 0)", ['ru', 'Русский']);
echo "✅ Rusça dili eklendi.\n";
