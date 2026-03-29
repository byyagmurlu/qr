<?php
// backend/api/test_ai_direct.php
require_once 'core/Database.php';
require_once 'config/config.php';

$apiKey = GEMINI_API_KEY;
if (!$apiKey) die("API KEY MISSING\n");

$text = "Serpme Kahvaltı";
$targetLang = "en";
$context = "product name";

// v1beta is often preferred for newer models
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey;




$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => "Translate 'Serpme Kahvaltı' to English. Return only the translation."]
            ]
        ]
    ]
];

echo "Calling Gemini AI ($url)...\n";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo "CURL ERROR: " . curl_error($ch) . "\n";
} else {
    echo "HTTP CODE: $httpCode\n";
    echo "RESPONSE: $result\n";
}
curl_close($ch);
