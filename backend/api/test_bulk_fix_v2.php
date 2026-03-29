<?php
require_once 'core/Database.php';
require_once 'config/config.php';

// Mock Auth and Response
namespace Core;
class Auth { public static function requireAuth() { return true; } }
class Response { public static function success($d) { echo "OK: " . json_encode($d) . "\n"; exit; } public static function error($m, $c=400) { echo "ERR: $m\n"; exit; } }

require_once 'controllers/AIController.php';
use Controllers\AIController;

$ai = new AIController();
$ai->bulkTranslate();
