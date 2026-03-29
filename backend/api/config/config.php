<?php
// backend/api/config/config.php

// ═══════════════════════════════════════════════════
// YEREL GELİŞTİRME → SQLite
// cPanel'e taşınırken DB_DRIVER'ı 'mysql' yapın ve
// MySQL bilgilerini doldurun.
// ═══════════════════════════════════════════════════

define('DB_DRIVER', 'sqlite');  // 'sqlite' | 'mysql'

// SQLite (yerel)
define('DB_SQLITE_PATH', dirname(__DIR__) . '/database/qrmenu.sqlite');

// MySQL (cPanel)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'qrmenu_db');
define('DB_CHARSET', 'utf8mb4');

// JWT
define('JWT_SECRET', 'antigravity_yedidegirmenler_secret_2026_change_in_production');

// AI
define('GEMINI_API_KEY', trim('AIzaSyCbmmrXEFQvx9EnEIMVoeabhFouC8qXkVU'));



// Timezone

date_default_timezone_set('Europe/Istanbul');

// Hata ayarlama (production'da 0 yapın)
error_reporting(E_ALL);
ini_set('display_errors', 0);
