<?php
$db = new PDO('sqlite:D:/gravity/qrmenu/backend/api/database/qrmenu.sqlite');
$p = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
$c = $db->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$s = $db->query("SELECT COUNT(*) FROM site_settings")->fetchColumn();
echo "Products: $p, Categories: $c, Settings: $s\n";
