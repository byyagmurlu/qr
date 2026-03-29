<?php
// backend/api/run_bulk_manual.php
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

$db = Database::getInstance();
$langs = $db->fetchAll("SELECT code FROM languages WHERE code != 'tr' AND is_active = 1");
$categories = $db->fetchAll("SELECT id, name FROM categories");
$products = $db->fetchAll("SELECT id, name FROM products");

foreach ($categories as $cat) {
    foreach ($langs as $l) {
        $exists = $db->fetchOne("SELECT id FROM translations WHERE entity_id = ? AND entity_type = ? AND field_name = ? AND language_code = ?", [$cat['id'], 'category', 'name', $l['code']]);
        if (!$exists) {
            echo "Category: {$cat['name']} in {$l['code']}\n";
            // Mock callGemini logic
            $apiKey = GEMINI_API_KEY;
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey;
            $data = ['contents'=>[['parts'=>[['text'=>"Translate Turkish: {$cat['name']} to language with code '{$l['code']}'. Only translation."]]]]];
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
            $trans = $d['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if ($trans) {
                $db->execute("INSERT OR REPLACE INTO translations (language_code, entity_type, entity_id, field_name, translation_text) VALUES (?, ?, ?, ?, ?)", 
                    [$l['code'], 'category', $cat['id'], 'name', trim($trans)]);
                echo "-> Translated: " . trim($trans) . "\n";
            } else {
                echo "-> FAILED: " . $res . "\n";
            }
            sleep(1); // avoid rate limit
        }
    }
}

foreach ($products as $prod) {
    foreach ($langs as $l) {
         $exists = $db->fetchOne("SELECT id FROM translations WHERE entity_id = ? AND entity_type = ? AND field_name = ? AND language_code = ?", [$prod['id'], 'product', 'name', $l['code']]);
         if (!$exists) {
            echo "Product: {$prod['name']} in {$l['code']}\n";
            $apiKey = GEMINI_API_KEY;
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey;
            $data = ['contents'=>[['parts'=>[['text'=>"Translate Turkish: {$prod['name']} to language with code '{$l['code']}'. Only translation."]]]]];
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
            $trans = $d['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if ($trans) {
                $db->execute("INSERT OR REPLACE INTO translations (language_code, entity_type, entity_id, field_name, translation_text) VALUES (?, ?, ?, ?, ?)", 
                    [$l['code'], 'product', $prod['id'], 'name', trim($trans)]);
                echo "-> Translated: " . trim($trans) . "\n";
            } else {
                echo "-> FAILED: " . $res . "\n";
            }
            sleep(1);
         }
    }
}
