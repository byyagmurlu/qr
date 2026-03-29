<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$links = $db->fetchAll("SELECT pa.*, at.name FROM product_allergens pa JOIN allergen_types at ON at.id = pa.allergen_id WHERE product_id = 12");
file_put_contents('prod_12_allergens.json', json_encode($links));
echo "Done";
