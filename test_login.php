<?php
require_once 'backend/api/config/config.php';
require_once 'backend/api/core/Database.php';

$data = ['username' => 'admin', 'password' => 'admin123'];
$url  = 'http://localhost:8080/v1/admin/auth/login';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$result = curl_exec($ch);
$code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP $code\n$result\n";
