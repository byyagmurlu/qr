<?php
require_once 'core/Database.php';
require_once 'config/config.php';
$db = \Core\Database::getInstance();
$res = $db->fetchAll('SELECT * FROM languages');
foreach ($res as $l) {
    echo "L: {$l['code']} | ACTIVE: {$l['is_active']} | NAME: {$l['name']}\n";
}
