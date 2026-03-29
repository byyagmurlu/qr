<?php
// backend/api/config/config.php
// Bu dosyayı config.example.php'den kopyalayın ve bilgileri doldurun.

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

// JWT - Üretimde güçlü bir secret kullanın!
define('JWT_SECRET', 'BURAYA_GIZLI_ANAHTAR_YAZIN');

// Google Gemini AI - https://aistudio.google.com adresinden alın
define('GEMINI_API_KEY', 'BURAYA_GEMINI_API_ANAHTARINI_YAZIN');

// Timezone
date_default_timezone_set('Europe/Istanbul');

// Hata ayarlama (production'da 0 yapın)
error_reporting(E_ALL);
ini_set('display_errors', 0);
