<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$all = $db->fetchAll("SELECT * FROM translations WHERE entity_id = 12 AND entity_type = 'product'");
file_put_contents('prod_12_all_trans.json', json_encode($all));
echo "Done";
