<?php
// backend/api/controllers/AllergenController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Models\Allergen;

class AllergenController {

    public function index(array $params): void {
        $model = new Allergen();
        Response::success($model->findAll(true));
    }

    public function adminIndex(array $params): void {
        Auth::requireAuth();
        $model = new Allergen();
        Response::success($model->findAll(false));
    }

    public function store(array $params): void {
        Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body['code']) || empty($body['name'])) {
            Response::error('Kod ve ad zorunludur.', 422);
        }

        $model = new Allergen();
        $id = $model->create($body);
        Response::success($model->findById($id), 'Alerjen oluşturuldu.', 201);
    }

    public function update(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $model = new Allergen();
        if (!$model->findById($id)) Response::error('Alerjen bulunamadı.', 404);

        $model->update($id, $body);
        Response::success($model->findById($id), 'Alerjen güncellendi.');
    }

    public function destroy(array $params): void {
        Auth::requireAuth();
        $id = (int)($params['id'] ?? 0);
        $model = new Allergen();
        if (!$model->findById($id)) Response::error('Alerjen bulunamadı.', 404);
        $model->delete($id);
        Response::success([], 'Alerjen silindi.');
    }
}
