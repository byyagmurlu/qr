<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

spl_autoload_register(function ($class) {
    $path = 'backend/api/' . str_replace('\\', '/', $class) . '.php';
    $path = lcfirst($path);
    $path = preg_replace_callback('/^([a-z]+)\//', fn($m) => strtolower($m[0]), $path);
    if (file_exists($path)) require_once $path;
});

require_once 'backend/api/config/config.php';

try {
    $db = \Core\Database::getInstance();
    $db->getPdo()->exec("ALTER TABLE categories ADD COLUMN created_by INTEGER DEFAULT NULL");
    echo "SUCCESS: created_by added to categories\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
