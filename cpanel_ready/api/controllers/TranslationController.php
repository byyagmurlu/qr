<?php
// backend/api/controllers/TranslationController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Models\Translation;

class TranslationController {
    public function index(array $params): void {
        Auth::requireAuth();
        $entityType = $_GET['type'] ?? '';
        $entityId   = (int)($_GET['id'] ?? 0);
        
        $model = new Translation();
        Response::success($model->getAllForEntity($entityType, $entityId));
    }

    public function store(array $params): void {
        Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        file_put_contents('trans_debug.log', "POST body: " . json_encode($body) . "\n", FILE_APPEND);
        
        if (empty($body['translations']) || !is_array($body['translations'])) {
            Response::error('Çeviri verisi eksik.', 422);
        }

        $model = new Translation();
        foreach ($body['translations'] as $t) {
            $model->set(
                $t['language_code'],
                $t['entity_type'],
                $t['entity_id'],
                $t['field_name'],
                $t['translation_text']
            );
        }

        Response::success([], 'Çeviriler kaydedildi.');
    }
}
