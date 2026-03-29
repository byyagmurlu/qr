<?php
// api/config/config.php

define('DB_DRIVER', 'mysql');  // cPanel için MySQL

// MySQL (cPanel)
define('DB_HOST', 'localhost');
define('DB_USER', 'yediridvan_qr');
define('DB_PASS', '$)@k~cL5?Dv2');
define('DB_NAME', 'yediridvan_qr');
define('DB_CHARSET', 'utf8mb4');

// SQLite bağlamasını bırakıyoruz.
define('DB_SQLITE_PATH', '');

// JWT (Güvenlik Anahtarı)
define('JWT_SECRET', 'cpanel_production_yedidegirmenler_yeni_secret');

// Google Gemini AI - Aktif kullanımdaki api anahtarı
define('GEMINI_API_KEY', trim('AIzaSyAtjED39NlYlYySidKDTqAdZbM11lxVuIk'));

// İzin verilen origin'ler (CORS) - cPanel Live URLs
define('ALLOWED_ORIGINS', 'https://www.yedidegirmenler.com,https://yedidegirmenler.com');

// Timezone
date_default_timezone_set('Europe/Istanbul');

// Hataları Gizle (production)
error_reporting(0);
ini_set('display_errors', 0);
