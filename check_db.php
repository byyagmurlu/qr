<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$info = $db->fetchAll("PRAGMA table_info(allergen_types)");
file_put_contents('db_info.json', json_encode($info));
echo "Done";
