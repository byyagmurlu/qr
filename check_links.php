<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$links = $db->fetchAll("SELECT * FROM product_allergens WHERE product_id = 23");
file_put_contents('prod_23_allergens.json', json_encode($links));
echo "Done";
