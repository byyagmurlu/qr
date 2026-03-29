<?php
// backend/api/test_list_models_full.php
require_once 'config/config.php';
$apiKey = GEMINI_API_KEY;
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$result = curl_exec($ch);
curl_close($ch);
$data = json_decode($result, true);
foreach ($data['models'] as $m) {
    echo "N: {$m['name']} | D: {$m['displayName']}\n";
}
