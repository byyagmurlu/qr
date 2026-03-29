<?php
// backend/api/controllers/SettingController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Models\Setting;

class SettingController {

    // Public: only expose non-sensitive settings
    public function publicIndex(array $params): void {
        $lang = $params['lang'] ?? 'tr';
        $model = new Setting();
        $all = $model->getAll($lang);
        $public = [];
        $allowedKeys = [
            'site_title','site_subtitle','site_description','phone','email','address','business_hours',
            'meta_keywords','meta_description','site_logo','site_favicon','out_of_stock_text',
            'menu_layout', 'primary_color', 'secondary_color', 'footer_text',
            'header_layout', 'header_opacity', 'header_height', 'footer_layout',
            'social_whatsapp', 'social_instagram', 'social_facebook', 'social_maps', 'google_font',
            'review_link', 'sb_show_address', 'sb_show_hours', 'sb_show_email', 'sb_show_phone',
            'footer_cta_text', 'footer_cta_link', 'footer_copyright'
        ];
        foreach ($allowedKeys as $key) {
            if (array_key_exists($key, $all)) {
                $public[$key] = $all[$key];
            }
        }
        Response::success($public);
    }

    // Admin: all settings
    public function adminIndex(array $params): void {
        Auth::requireAuth();
        $model = new Setting();
        Response::success($model->getAll());
    }

    // Admin: update many settings at once
    public function update(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body)) Response::error('Güncellenecek ayar bulunamadı.', 422);

        $model = new Setting();
        $model->setMany($body, $payload['sub']);
        Response::success($model->getAll(), 'Ayarlar güncellendi.');
    }

    // Admin: upload setting image (logo, favicon etc)
    public function uploadImage(array $params): void {
        $payload = Auth::requireAuth();
        $key = $params['key'] ?? null;
        if (!in_array($key, ['site_logo', 'site_favicon'])) Response::error('Geçersiz ayar anahtarı.', 422);

        if (empty($_FILES['image'])) Response::error('Görsel dosyası gereklidir.', 422);

        $file = $_FILES['image'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "{$key}." . time() . ".$ext";
        $uploadDir = dirname(__DIR__) . '/uploads/';

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
            Response::error('Dosya yükleme hatası.', 500);
        }

        $model = new Setting();
        $model->set($key, '/uploads/' . $filename);
        Response::success(['url' => '/uploads/' . $filename], 'Görsel kaydedildi.');
    }
}
