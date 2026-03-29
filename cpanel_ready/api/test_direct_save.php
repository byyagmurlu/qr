<?php
// backend/api/test_direct_save.php
require_once 'core/Database.php';
require_once 'config/config.php';
spl_autoload_register(function ($class) {
    if (strpos($class, 'Core\\') === 0) {
        $path = str_replace('\\', '/', $class) . '.php';
        $path = lcfirst($path);
        if (file_exists($path)) require_once $path;
    }
});

use Core\Database;

$apiKey = GEMINI_API_KEY;
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey;
$data = ['contents'=>[['parts'=>[['text'=>'Translate Turkish: Kahvaltı to English. Only the word.']]]]];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$res = curl_exec($ch);
curl_close($ch);

$d = json_decode($res, true);
$trans = $d['candidates'][0]['content']['parts'][0]['text'] ?? "FAIL";

if ($trans !== "FAIL") {
    $db = Database::getInstance();
    $db->execute("INSERT OR REPLACE INTO translations (language_code, entity_type, entity_id, field_name, translation_text) VALUES (?, ?, ?, ?, ?)", 
        ['en', 'category', 9, 'name', trim($trans)]);
    echo "SAVED: " . trim($trans) . "\n";
} else {
    echo "GEMINI FAILED: " . $res . "\n";
}
