<?php
$db = new PDO('sqlite:backend/api/database/qrmenu.sqlite');
$stmt = $db->query("PRAGMA table_info(site_settings)");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach($columns as $c) echo $c['name'] . "\n";
