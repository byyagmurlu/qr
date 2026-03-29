<?php
// backend/api/print_full_models.php
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
$models = [];
if (isset($d['models'])) {
    foreach($d['models'] as $m) $models[] = $m['name'];
}
file_put_contents('test_models_list.json', json_encode($models));
echo "Models captured to test_models_list.json\n";
