<?php
require_once 'core/Database.php';
require_once 'config/config.php';
require_once 'controllers/AIController.php';
require_once 'core/Response.php';

use Controllers\AIController;

// Mock Response to not die
class MockResponse {
    public static function error($m, $c=400) { echo "ERROR: $m\n"; }
    public static function success($d) { echo "SUCCESS: " . json_encode($d) . "\n"; }
}

$ai = new AIController();
$ai->bulkTranslate();
