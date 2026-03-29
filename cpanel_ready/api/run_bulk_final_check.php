<?php
// backend/api/run_bulk_final_check.php
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
    if (strpos($class, 'Models\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
});

// Mock Response to see the output
namespace Core;
class Response { public static function success($d, $m='') { file_put_contents('bulk_result.json', json_encode($d)); echo "BULK OK: $m\n"; } public static function error($m, $c=400) { echo "BULK ERR: $m\n"; } }

use Controllers\AIController;

$ai = new AIController();
$ai->bulkTranslate();
