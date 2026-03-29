<?php
// backend/api/print_models_working.php
require_once 'config/config.php';
$apiKey = GEMINI_API_KEY;
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
$res = curl_exec($ch);
curl_close($ch);
$d = json_decode($res, true);
if (!$d) { echo "REPLY: $res\n"; exit; }
foreach($d['models'] as $m) {
    if (strpos($m['name'], 'gemini') !== false) {
        echo $m['name'] . "\n";
    }
}
