<?php
$db = new PDO('sqlite:backend/api/database/qrmenu.sqlite');
foreach($db->query("SELECT * FROM languages") as $row) {
    echo "ID: {$row['id']}, Code: {$row['code']}, Name: {$row['name']}, Active: {$row['is_active']}, Default: {$row['is_default']}\n";
}
