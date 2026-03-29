<?php
require_once 'backend/api/core/Database.php';
$db = \Core\Database::getInstance();
$result = $db->fetchAll("PRAGMA table_info(categories)");
print_r($result);
