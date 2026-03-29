<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();
$table = 'site_settings';
$res = $db->fetchAll("PRAGMA table_info($table)");
echo "Columns in $table:\n";
foreach($res as $r) { echo "- " . $r['name'] . "\n"; }
