<?php
// backend/api/controllers/LanguageController.php

namespace Controllers;

use Core\Response;
use Models\Language;

class LanguageController {
    public function index(array $params): void {
        $model = new Language();
        Response::success($model->getAll(true));
    }
}
