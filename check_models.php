<?php
require_once 'backend/api/config/config.php';

$apiKey = GEMINI_API_KEY;
$url = "https://generativelanguage.googleapis.com/v1/models?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$result = curl_exec($ch);
$info = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "Status: $info\n";
echo "Result: $result\n";
