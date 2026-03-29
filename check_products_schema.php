<?php
require_once 'backend/api/index.php';
$db = \Core\Database::getInstance();
$result = $db->fetchAll("PRAGMA table_info(products)");
foreach ($result as $row) {
    echo $row['name'] . "\n";
}
