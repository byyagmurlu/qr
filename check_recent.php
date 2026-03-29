<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$prods = $db->fetchAll("SELECT id, name FROM products ORDER BY id DESC LIMIT 10");
file_put_contents('recent_prods.json', json_encode($prods));
$allergens = $db->fetchAll("SELECT id, name FROM allergen_types ORDER BY id DESC");
file_put_contents('recent_allergens.json', json_encode($allergens));
echo "Done";
