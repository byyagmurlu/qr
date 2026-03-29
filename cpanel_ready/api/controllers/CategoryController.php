<?php
// backend/api/controllers/CategoryController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Models\Category;

class CategoryController {

    // Public
    public function index(array $params): void {
        $lang = $_GET['lang'] ?? 'tr';
        $model = new Category();
        $categories = $model->findAll($lang, true);
        Response::success($categories);
    }

    // Admin - all categories
    public function adminIndex(array $params): void {
        Auth::requireAuth();
        $model = new Category();
        Response::success($model->findAll(false));
    }

    public function show(array $params): void {
        Auth::requireAuth();
        $model = new Category();
        $cat = $model->findById((int)($params['id'] ?? 0));
        if (!$cat) Response::error('Kategori bulunamadı.', 404);
        Response::success($cat);
    }

    public function store(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body['name'])) Response::error('Kategori adı zorunludur.', 422);

        $body['created_by'] = $payload['sub'];
        $model = new Category();
        $id = $model->create($body);

        Response::success($model->findById($id), 'Kategori oluşturuldu.', 201);
    }

    public function update(array $params): void {
        Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int)($params['id'] ?? 0);

        $model = new Category();
        if (!$model->findById($id)) Response::error('Kategori bulunamadı.', 404);

        $model->update($id, $body);
        Response::success($model->findById($id), 'Kategori güncellendi.');
    }

    public function destroy(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);

        $model = new Category();
        if (!$model->findById($id)) Response::error('Kategori bulunamadı.', 404);

        $model->delete($id);
        Response::success([], 'Kategori silindi.');
    }

    public function uploadImage(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $model = new Category();
        $cat = $model->findById($id);
        if (!$cat) Response::error('Kategori bulunamadı.', 404);

        if (!isset($_FILES['image'])) Response::error('Resim dosyası gönderilmedi.', 422);

        $file = $_FILES['image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($ext, $allowed)) Response::error('Sadece JPG, PNG ve WEBP desteklenir.', 422);

        $uploadDir = dirname(__DIR__) . '/uploads/categories/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileName = 'category_' . $id . '_' . time() . '.' . $ext;
        $target = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $target)) {
            $url = '/uploads/categories/' . $fileName;
            $model->update($id, ['image' => $url]);
            Response::success(['image' => $url], 'Kategori resmi güncellendi.');
        } else {
            Response::error('Dosya yüklenemedi.', 500);
        }
    }
}
