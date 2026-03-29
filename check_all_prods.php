<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$prods = $db->fetchAll("SELECT id, name FROM products");
file_put_contents('all_prods.json', json_encode($prods));
echo "Done";
