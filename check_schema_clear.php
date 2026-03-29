<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Mocking some constants or includes if needed
spl_autoload_register(function ($class) {
    $path = 'backend/api/' . str_replace('\\', '/', $class) . '.php';
    $path = lcfirst($path);
    $path = preg_replace_callback('/^([a-z]+)\//', fn($m) => strtolower($m[0]), $path);
    if (file_exists($path)) require_once $path;
});

require_once 'backend/api/config/config.php';

try {
    $db = \Core\Database::getInstance();
    $result = $db->fetchAll("PRAGMA table_info(categories)");
    foreach ($result as $row) {
        echo $row['name'] . " (" . $row['type'] . ")\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
