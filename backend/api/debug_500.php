<?php
// backend/api/debug_500.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'core/Database.php';
require_once 'config/config.php';
require_once 'core/Auth.php';
require_once 'core/Response.php';

spl_autoload_register(function ($class) {
    if (strpos($class, 'Core\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
    if (strpos($class, 'Controllers\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
    if (strpos($class, 'Models\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
});

use Controllers\AIController;

$ai = new AIController();
try {
    $ai->bulkTranslate();
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo $e->getTraceAsString();
}
