<?php
// If running under PHP built-in server and file exists, serve it directly
if (php_sapi_name() === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

// =============================================
// SECURITY HEADERS
// =============================================
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// CORS
$allowedOrigins = defined('ALLOWED_ORIGINS') ? explode(',', ALLOWED_ORIGINS) : ['http://localhost:5173', 'http://localhost:5174'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins) || empty($origin)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// Autoloader: maps Namespace\ClassName -> ./namespace/ClassName.php (lowercase dirs)
spl_autoload_register(function ($class) {
    $path = str_replace('\\', '/', $class) . '.php';
    $path = lcfirst($path); // lowercase first char (Core → core)
    // Lowercase namespace segments only (not class names)
    $path = preg_replace_callback('/^([a-z]+)\//', fn($m) => strtolower($m[0]), $path);
    if (file_exists($path)) require_once $path;
});

// Require config
require_once 'config/config.php';

use Core\Router;
use Core\Response;
use Controllers\AuthController;
use Controllers\CategoryController;
use Controllers\ProductController;
use Controllers\AllergenController;
use Controllers\SettingController;
use Controllers\LanguageController;
use Controllers\TranslationController;
use Controllers\BulkController;


$router = new Router();

// =============================================
// PUBLIC STATUS
// =============================================
$router->get('status', function() {
    Response::success([
        'api'         => 'Yedideğirmenler QR Menü API',
        'version'     => '1.0.0',
        'php_version' => phpversion(),
        'time'        => date('Y-m-d H:i:s'),
    ]);
});

// =============================================
// PUBLIC SETTINGS
// =============================================
$router->get('v1/settings', [SettingController::class, 'publicIndex']);

// =============================================
// PUBLIC CATEGORIES
// =============================================
$router->get('v1/categories', [CategoryController::class, 'index']);

// =============================================
// PUBLIC PRODUCTS
// =============================================
$router->get('v1/products',                 [ProductController::class, 'index']);
$router->get('v1/categories/:slug/products', [ProductController::class, 'byCategory']);
$router->get('v1/products/:slug',             [ProductController::class, 'show']);

// =============================================
// PUBLIC ALLERGENS
// =============================================
$router->get('v1/allergens', [AllergenController::class, 'index']);

// =============================================
// PUBLIC LANGUAGES
// =============================================
$router->get('v1/languages', [LanguageController::class, 'index']);

// =============================================
// ADMIN AUTH
// =============================================
$router->post('v1/admin/auth/login',            [AuthController::class, 'login']);
$router->get('v1/admin/auth/me',                [AuthController::class, 'me']);
$router->put('v1/admin/auth/profile',           [AuthController::class, 'updateProfile']);
$router->post('v1/admin/auth/change-password',  [AuthController::class, 'changePassword']);

// =============================================
// ADMIN SETTINGS
// =============================================
$router->get('v1/admin/settings',  [SettingController::class, 'adminIndex']);
$router->put('v1/admin/settings',  [SettingController::class, 'update']);

// =============================================
// ADMIN CATEGORIES
// =============================================
$router->get('v1/admin/categories',       [CategoryController::class, 'adminIndex']);
$router->get('v1/admin/categories/:id',   [CategoryController::class, 'show']);
$router->post('v1/admin/categories',      [CategoryController::class, 'store']);
$router->put('v1/admin/categories/:id',   [CategoryController::class, 'update']);
$router->delete('v1/admin/categories/:id', [CategoryController::class, 'destroy']);
$router->post('v1/admin/categories/:id/image', [CategoryController::class, 'uploadImage']);

// =============================================
// ADMIN PRODUCTS
// =============================================
$router->get('v1/admin/products',                             [ProductController::class, 'adminIndex']);
$router->get('v1/admin/products/:id',                         [ProductController::class, 'adminShow']);
$router->post('v1/admin/products',                            [ProductController::class, 'store']);
$router->put('v1/admin/products/:id',                         [ProductController::class, 'update']);
$router->delete('v1/admin/products/:id',                      [ProductController::class, 'destroy']);
$router->post('v1/admin/products/:id/image',                  [ProductController::class, 'uploadImage']);
$router->post('v1/admin/products/:id/allergens',              [ProductController::class, 'setAllergen']);
$router->delete('v1/admin/products/:id/allergens/:allergen_id', [ProductController::class, 'removeAllergen']);
$router->post('v1/admin/settings/upload/:key',                [SettingController::class, 'uploadImage']);

// =============================================
// ADMIN ALLERGENS
// =============================================
$router->get('v1/admin/allergens',         [AllergenController::class, 'adminIndex']);
$router->post('v1/admin/allergens',        [AllergenController::class, 'store']);
$router->put('v1/admin/allergens/:id',     [AllergenController::class, 'update']);
$router->delete('v1/admin/allergens/:id',  [AllergenController::class, 'destroy']);

// =============================================
// ADMIN BULK OPERATIONS
// =============================================
$router->get('v1/admin/bulk/export', [Controllers\BulkController::class, 'export']);
$router->get('v1/admin/bulk/sample', [Controllers\BulkController::class, 'downloadSample']);
$router->post('v1/admin/bulk/import', [Controllers\BulkController::class, 'import']);


// =============================================
// ADMIN AI OPERATIONS
// =============================================
$router->post('v1/admin/ai/translate', [Controllers\AIController::class, 'translate']);
$router->post('v1/admin/ai/bulk-translate', [Controllers\AIController::class, 'bulkTranslate']);

// =============================================
// ADMIN TRANSLATIONS

// =============================================
$router->get('v1/admin/translations',           [Controllers\TranslationController::class, 'index']);
$router->post('v1/admin/translations',          [Controllers\TranslationController::class, 'store']);

// =============================================
// FILE UPLOADS
// =============================================
// =============================================
// DISPATCH
// =============================================
// Clean URL support: prioritize $_GET['route'] (from .htaccess), otherwise extract from REQUEST_URI
$requestedRoute = $_GET['route'] ?? null;
if (!$requestedRoute) {
    $requestedRoute = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $requestedRoute = trim($requestedRoute, '/');
} else {
    $requestedRoute = trim($requestedRoute, '/');
}

$requestMethod  = $_SERVER['REQUEST_METHOD'];
try {
    $router->dispatch($requestedRoute, $requestMethod);
} catch (\Throwable $e) {
    Response::error("Sistem Hatası: " . $e->getMessage(), 500);
}

