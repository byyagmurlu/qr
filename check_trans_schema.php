<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$info = $db->fetchAll("PRAGMA table_info(translations)");
file_put_contents('trans_schema.json', json_encode($info));
echo "Done";
