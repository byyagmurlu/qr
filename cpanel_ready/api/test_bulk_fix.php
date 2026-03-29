<?php
// backend/api/test_bulk_fix.php
require_once 'core/Database.php';
require_once 'config/config.php';

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
});

use Controllers\AIController;

// Intercept success response if possible... or just use a modified version
$ai = new AIController();
$ai->bulkTranslate();
