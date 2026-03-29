<?php
require_once 'backend/api/config/config.php';
spl_autoload_register(function ($class) {
    if (file_exists('backend/api/' . str_replace('\\', '/', $class) . '.php')) {
        require_once 'backend/api/' . str_replace('\\', '/', $class) . '.php';
    }
});
$db = \Core\Database::getInstance();
$categories = $db->fetchAll("SELECT * FROM categories");
echo "CATEGORIES: " . count($categories) . "\n";
print_r($categories);
