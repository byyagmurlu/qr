<?php
// backend/api/controllers/ProductController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Models\Product;

class ProductController {
    // Public: all products
    public function index(array $params): void {
        $lang = $_GET['lang'] ?? 'tr';
        $model = new Product();
        Response::success($model->getAllPublic($lang));
    }

    // Public: products by category slug
    public function byCategory(array $params): void {
        $slug = $params['slug'] ?? '';
        $lang = $_GET['lang'] ?? 'tr';

        $model = new Product();
        $products = $model->findByCategorySlug($slug, $lang);
        Response::success($products);
    }

    // Public: single product by slug
    public function show(array $params): void {
        $slug = $params['slug'] ?? '';
        $model = new Product();
        $product = $model->findBySlug($slug);

        if (!$product) Response::error('Ürün bulunamadı.', 404);
        Response::success($product);
    }

    // Admin: paginated list
    public function adminIndex(array $params): void {
        Auth::requireAuth();
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 20);
        $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

        $model = new Product();
        $result = $model->findAll($page, $limit, $categoryId);

        Response::json(['success' => true, ...$result]);
    }

    // Admin: single by id
    public function adminShow(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $model = new Product();
        $product = $model->findById($id);
        if (!$product) Response::error('Ürün bulunamadı.', 404);
        Response::success($product);
    }

    // Admin: create
    public function store(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body['name'])) Response::error('Ürün adı zorunludur.', 422);
        if (empty($body['category_id'])) Response::error('Kategori zorunludur.', 422);
        if (!isset($body['price'])) Response::error('Fiyat zorunludur.', 422);

        $body['created_by'] = $payload['sub'];
        $model = new Product();
        $id = $model->create($body);

        // Link allergens if provided
        if (!empty($body['allergen_ids']) && is_array($body['allergen_ids'])) {
            foreach ($body['allergen_ids'] as $allergenId) {
                $model->setAllergen($id, (int)$allergenId, 'trace');
            }
        }

        Response::success($model->findById($id), 'Ürün oluşturuldu.', 201);
    }

    // Admin: update
    public function update(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $model = new Product();
        if (!$model->findById($id)) Response::error('Ürün bulunamadı.', 404);

        $model->update($id, $body);

        // Sync allergens
        if (isset($body['allergen_ids']) && is_array($body['allergen_ids'])) {
            $model->syncAllergens($id, $body['allergen_ids']);
        }

        Response::success($model->findById($id), 'Ürün güncellendi.');
    }

    // Admin: delete
    public function destroy(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $model = new Product();
        if (!$model->findById($id)) Response::error('Ürün bulunamadı.', 404);
        $model->delete($id);
        Response::success([], 'Ürün silindi.');
    }

    // Admin: upload image
    public function uploadImage(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $model = new Product();
        if (!$model->findById($id)) Response::error('Ürün bulunamadı.', 404);

        if (empty($_FILES['image'])) Response::error('Görsel dosyası gereklidir.', 422);

        $file = $_FILES['image'];
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

        if (!in_array($file['type'], $allowedTypes)) {
            Response::error('Sadece JPG, PNG, WEBP ve GIF formatları geçerlidir. Gönderilen tip: ' . $file['type'], 422);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "products/product-{$id}-" . time() . ".$ext";
        $uploadDir = dirname(__DIR__) . '/uploads/products/';

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . basename($filename))) {
            Response::error('Dosya yükleme hatası.', 500);
        }

        $model->updateImage($id, $filename);
        Response::success(['image_url' => '/uploads/' . $filename], 'Görsel yüklendi.');
    }

    // Admin: set allergen on product
    public function setAllergen(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body['allergen_id'])) Response::error('Alerjen ID zorunludur.', 422);

        $model = new Product();
        $model->setAllergen($id, (int)$body['allergen_id'], $body['severity'] ?? 'trace');

        Response::success([], 'Alerjen eklendi.');
    }

    // Admin: remove allergen from product
    public function removeAllergen(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $allergenId = (int)($params['allergen_id'] ?? 0);

        $model = new Product();
        $model->removeAllergen($id, $allergenId);
        Response::success([], 'Alerjen kaldırıldı.');
    }
}
