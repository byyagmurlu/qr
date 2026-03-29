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
$categories = $db->fetchAll("SELECT id, name, is_active FROM categories");
foreach ($categories as $cat) {
    echo $cat['id'] . ": " . $cat['name'] . " [is_active=" . $cat['is_active'] . "]\n";
}
