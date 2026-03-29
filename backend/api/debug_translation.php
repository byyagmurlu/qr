<?php
// backend/api/debug_translation.php
require_once 'core/Database.php';
require_once 'config/config.php';
spl_autoload_register(function ($class) {
    if (strpos($class, 'Models\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
});

use Models\Category;
use Models\Product;

echo "--- CATEGORIES (EN) ---\n";
$catModel = new Category();
$cats = $catModel->findAll('en', true);
foreach ($cats as $c) {
    echo "ID: {$c['id']} | NAME: {$c['name']}\n";
}

echo "\n--- PRODUCTS (EN) ---\n";
$prodModel = new Product();
$prods = $prodModel->getAllPublic('en');
foreach ($prods as $p) {
    echo "ID: {$p['id']} | NAME: {$p['name']} | DESC: {$p['description']}\n";
}
