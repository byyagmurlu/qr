<?php
require_once 'core/Database.php';
require_once 'config/config.php';
use Core\Database;

$db = Database::getInstance();
$langs = $db->fetchAll("SELECT code FROM languages WHERE code != 'tr' AND is_active = 1");
echo "LANGS TO TRANSLATE: " . count($langs) . "\n";
foreach($langs as $l) echo "- {$l['code']}\n";

$categories = $db->fetchAll("SELECT id, name FROM categories");
echo "CATEGORIES FOUND: " . count($categories) . "\n";

$products = $db->fetchAll("SELECT id, name FROM products");
echo "PRODUCTS FOUND: " . count($products) . "\n";

$translations = $db->fetchAll("SELECT * FROM translations");
echo "TRANSLATIONS ALREADY IN DB: " . count($translations) . "\n";
