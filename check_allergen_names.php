<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$names = $db->fetchAll("SELECT id, name FROM allergen_types WHERE id IN (1, 8)");
file_put_contents('allergen_names.json', json_encode($names));
echo "Done";
