<?php
require_once 'core/Database.php';
require_once 'config/config.php';
spl_autoload_register(function ($class) {
    if (strpos($class, 'Models\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
});

use Core\Database;

$db = Database::getInstance();
$langs = $db->fetchAll("SELECT code FROM languages WHERE code != 'tr' AND is_active = 1");
$stats = ['products' => 0, 'categories' => 0];

$categories = $db->fetchAll("SELECT id, name FROM categories");
foreach ($categories as $cat) {
    foreach ($langs as $l) {
        echo "Checking category {$cat['id']} ({$cat['name']}) lang {$l['code']}\n";
        $exists = $db->fetchOne("SELECT * FROM translations WHERE entity_id = ? AND entity_type = ? AND field_name = ? AND language_code = ?", [$cat['id'], 'category', 'name', $l['code']]);
        if (!$exists) {
            echo "-> Missing translation for category name!\n";
            $stats['categories']++;
        }
    }
}

$products = $db->fetchAll("SELECT id, name FROM products");
foreach ($products as $prod) {
    foreach ($langs as $l) {
         echo "Checking product {$prod['id']} ({$prod['name']}) lang {$l['code']}\n";
         $exists = $db->fetchOne("SELECT * FROM translations WHERE entity_id = ? AND entity_type = ? AND field_name = ? AND language_code = ?", [$prod['id'], 'product', 'name', $l['code']]);
         if (!$exists) {
             echo "-> Missing translation for product name!\n";
             $stats['products']++;
         }
    }
}

echo "STATS: PRODS: {$stats['products']} | CATS: {$stats['categories']}\n";
