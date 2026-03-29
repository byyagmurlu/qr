<?php
// backend/api/controllers/AIController.php

namespace Controllers;

use Core\Database;
use Core\Response;
use Core\Auth;

class AIController {
    private $apiKey;

    public function __construct() {
        $this->apiKey = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '';
    }

    public function translate(): void {
        Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true);
        $text = $body['text'] ?? '';
        $lang = $body['target_lang'] ?? 'en';
        $context = $body['context'] ?? 'general';

        if (empty($text)) {
            Response::error('Metin boş olamaz.', 400);
        }

        $translated = $this->callGemini($text, $lang, $context);
        if ($translated) {
            Response::success(['translated' => $translated]);
        } else {
            Response::error('Yapay zeka çevirisi sırasında bir hata oluştu. Lütfen API anahtarını kontrol edin.', 500);
        }
    }

    /** Translates all products and categories to all active languages that are missing translations */
    public function bulkTranslate(): void {
        set_time_limit(0); 
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $force = ($body['force'] ?? 0) == 1;

        if (PHP_SAPI !== 'cli') {
            Auth::requireAuth();
        }

        $db = Database::getInstance();
        if (empty($this->apiKey)) {
            Response::error('Gemini API anahtarı ayarlanmamış.', 400);
        }

        $langs = $db->fetchAll("SELECT code FROM languages WHERE code != 'tr' AND is_active = 1");
        file_put_contents('ai_debug.log', "[BULK START] Found " . count($langs) . " languages. Body: " . json_encode($body) . "\n", FILE_APPEND);
        if (empty($langs)) {
            Response::error('Aktif çeviri dili bulunamadı.', 400);
        }


        if ($force) {
            $langCodes = array_map(fn($l) => "'{$l['code']}'", $langs);
            $langList = implode(',', $langCodes);
            $db->execute("DELETE FROM translations WHERE language_code IN ($langList)");
        }

        $stats = ['products' => 0, 'categories' => 0, 'settings' => 0, 'allergens' => 0];

        foreach ($langs as $l) {
            $batch = []; // key: unique_id, value: text
            
            // 1. PRIORITIZE ALLERGENS
            $allergens = $db->fetchAll("SELECT id, name FROM allergen_types");
            foreach ($allergens as $all) {
                if (!empty($all['name']) && !$this->hasTranslation($all['id'], 'allergen', 'name', $l['code'])) {
                    $batch["all_{$all['id']}_name"] = $all['name'];
                }
            }

            // 2. Categories
            $categories = $db->fetchAll("SELECT id, name, description FROM categories");
            foreach ($categories as $cat) {
                if (!empty($cat['name']) && !$this->hasTranslation($cat['id'], 'category', 'name', $l['code'])) {
                    $batch["cat_{$cat['id']}_name"] = $cat['name'];
                }
                if (!empty($cat['description']) && !$this->hasTranslation($cat['id'], 'category', 'description', $l['code'])) {
                    $batch["cat_{$cat['id']}_desc"] = $cat['description'];
                }
            }

            // 3. Products
            $products = $db->fetchAll("SELECT id, name, description, serving_size FROM products");
            foreach ($products as $prod) {
                if (!empty($prod['name']) && !$this->hasTranslation($prod['id'], 'product', 'name', $l['code'])) {
                    $batch["prod_{$prod['id']}_name"] = $prod['name'];
                }
                if (!empty($prod['description']) && !$this->hasTranslation($prod['id'], 'product', 'description', $l['code'])) {
                    $batch["prod_{$prod['id']}_desc"] = $prod['description'];
                }
                if (!empty($prod['serving_size']) && !$this->hasTranslation($prod['id'], 'product', 'serving_size', $l['code'])) {
                    $batch["prod_{$prod['id']}_serving"] = $prod['serving_size'];
                }
            }

            // 4. Settings
            $transKeys = ['site_title', 'site_subtitle', 'site_description', 'address', 'copyright_text', 'review_text'];
            $settings = $db->fetchAll("SELECT id, setting_key, setting_value FROM site_settings");
            foreach ($settings as $s) {
                if (in_array($s['setting_key'], $transKeys) && !empty($s['setting_value']) && !$this->hasTranslation($s['id'], 'setting', $s['setting_key'], $l['code'])) {
                    $batch["set_{$s['id']}_{$s['setting_key']}"] = $s['setting_value'];
                }
            }

            if (!empty($batch)) {
                // Perform translation in very small chunks (10 items) to prevent Gemini Rate Limit (Tokens per minute & Requests per minute limits)
                $chunks = array_chunk($batch, 10, true);
                foreach ($chunks as $chunk) {
                    $translatedBatch = $this->callGeminiBatch($chunk, $l['code']);
                    if ($translatedBatch) {
                        foreach ($translatedBatch as $key => $val) {
                            $parts = explode('_', $key);
                            if (count($parts) < 3) continue;
                            
                            $prefix = $parts[0];
                            $entityId = (int)$parts[1];
                            $fieldSuffix = implode('_', array_slice($parts, 2));

                            if ($prefix === 'cat') {
                                $field = ($fieldSuffix === 'desc') ? 'description' : 'name';
                                $this->saveTranslation($entityId, 'category', $field, $l['code'], $val);
                                $stats['categories']++;
                            } elseif ($prefix === 'prod') {
                                $field = 'name';
                                if ($fieldSuffix === 'desc') $field = 'description';
                                if ($fieldSuffix === 'serving') $field = 'serving_size';
                                $this->saveTranslation($entityId, 'product', $field, $l['code'], $val);
                                $stats['products']++;
                            } elseif ($prefix === 'all') {
                                $this->saveTranslation($entityId, 'allergen', 'name', $l['code'], $val);
                                $stats['allergens']++;
                            } elseif ($prefix === 'set') {
                                $this->saveTranslation($entityId, 'setting', $fieldSuffix, $l['code'], $val);
                                $stats['settings']++;
                            }
                        }
                    } else {
                        // All retries failed
                        Response::error('Google AI servisi kota aşımı nedeniyle şu anda yanıt veremiyor. Lütfen birkaç dakika sonra tekrar deneyin.', 429);
                    }
                    usleep(5000000); // 5 seconds default delay between chunks
                }
            }
        }

        Response::success($stats, 'Yapay zeka çeviri işlemi tamamlandı.');
    }

    private function hasTranslation(int $id, string $type, string $field, string $langCode): bool {
        $db = Database::getInstance();
        $exists = $db->fetchOne("SELECT id FROM translations WHERE entity_id = ? AND entity_type = ? AND field_name = ? AND language_code = ?", [$id, $type, $field, $langCode]);
        return (bool)$exists;
    }

    private function saveTranslation(int $id, string $type, string $field, string $langCode, string $text): void {
        $db = Database::getInstance();
        $db->execute("INSERT OR REPLACE INTO translations (entity_id, entity_type, field_name, language_code, translation_text) VALUES (?, ?, ?, ?, ?)", 
            [$id, $type, $field, $langCode, $text]);
    }

    private function callGeminiBatch(array $items, string $targetLang): ?array {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $this->apiKey;



        
        $jsonItems = json_encode($items, JSON_UNESCAPED_UNICODE);
        $prompt = "You are a professional restaurant menu translator. 
        Translate the values in this JSON from Turkish to language code: '{$targetLang}'.
        
        JSON to Translate:
        {$jsonItems}
        
        CRITICAL RULES:
        1. Return ONLY the translated JSON.
        2. KEEP the SAME KEYS.
        3. DO NOT include any explanations, code blocks or markdown.
        4. Ensure natural restaurant terminology.
        5. For traditional dishes with no direct 1-to-1 name (e.g., Menemen, Kuymak, Mıhlama), provide a clear, appetizing English descriptive name (e.g., 'Menemen' -> 'Traditional Turkish Scrambled Eggs', 'Kuymak' or 'Mıhlama' -> 'Turkish Cheese Fondue').";


        $data = [
            'contents' => [['parts' => [['text' => $prompt]]]]
        ];

        $maxRetries = 10;
        for ($i = 0; $i < $maxRetries; $i++) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            
            $result = curl_exec($ch);
            $info = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($info === 200) {
                break; // Success
            } elseif ($info === 429) {
                // Parse retryDelay dynamically from Google's response
                $waitSecs = 20; // Default fallback to 20s
                $respJson = json_decode($result, true);
                if (isset($respJson['error']['details'])) {
                    foreach ($respJson['error']['details'] as $detail) {
                        if (isset($detail['retryDelay'])) {
                            $waitSecs = (int)str_replace('s', '', $detail['retryDelay']) + 2; // e.g. "52s" -> 54s
                        }
                    }
                }
                
                $retryCount = $i + 1;
                file_put_contents('ai_debug.log', "[" . date('H:i:s') . "] [429] Google limit: Waiting {$waitSecs}s... (Attempt {$retryCount} of {$maxRetries})\n", FILE_APPEND);
                
                // Sleep using the explicitly requested seconds
                sleep($waitSecs);
                continue;
            } else {
                file_put_contents('ai_debug.log', "[$info] BATCH ERROR: " . $result . "\n", FILE_APPEND);
                return null;
            }
        }

        if ($info !== 200) {
            return null;
        }

        $response = json_decode($result, true);
        $rawText = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
        
        // Clean markdown if AI included it
        $rawText = preg_replace('/^```(json)?|```$/m', '', $rawText);
        $rawText = trim($rawText);

        
        $translated = json_decode($rawText, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            file_put_contents('ai_debug.log', "[PARSE ERROR] Could not parse AI response as JSON: " . $rawText . "\n", FILE_APPEND);
            return null;
        }

        file_put_contents('ai_debug.log', "[200 OK] Batch Success\n", FILE_APPEND);
        return $translated;
    }

    private function callGemini(string $text, string $targetLang, string $context): ?string {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $this->apiKey;



        $prompt = "Translate '{$text}' from Turkish to code '{$targetLang}' (Context: {$context}). Return ONLY translated text.";

        $data = [
            'contents' => [['parts' => [['text' => $prompt]]]]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        $result = curl_exec($ch);
        $info = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($info !== 200) return null;

        $response = json_decode($result, true);
        $translated = $response['candidates'][0]['content']['parts'][0]['text'] ?? null;
        return $translated ? trim($translated) : null;
    }
}
