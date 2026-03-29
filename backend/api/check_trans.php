<?php
// backend/api/check_trans.php
require_once 'core/Database.php';
require_once 'config/config.php';

use Core\Database;

$db = Database::getInstance();
$res = $db->fetchAll('SELECT * FROM translations LIMIT 50');
foreach ($res as $row) {
    echo "L: {$row['language_code']} | T: {$row['entity_type']} | ID: {$row['entity_id']} | F: {$row['field_name']} | V: {$row['translation_text']}\n";
}
if (empty($res)) echo "No translations found!\n";
