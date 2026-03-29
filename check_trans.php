<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$trans = $db->fetchAll("SELECT * FROM translations");
file_put_contents('translations_info.json', json_encode($trans));
echo "Done";
