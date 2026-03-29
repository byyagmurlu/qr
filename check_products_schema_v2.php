<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
spl_autoload_register(function ($class) {
    if (file_exists('backend/api/' . str_replace('\\', '/', $class) . '.php')) {
        require_once 'backend/api/' . str_replace('\\', '/', $class) . '.php';
    }
});
require_once 'backend/api/config/config.php';
$db = \Core\Database::getInstance();
$result = $db->fetchAll("PRAGMA table_info(products)");
foreach ($result as $row) {
    echo $row['name'] . "\n";
}
