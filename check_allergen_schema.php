<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$info = $db->fetchAll("PRAGMA table_info(allergen_types)");
file_put_contents('allergen_schema.json', json_encode($info));
echo "Done";
