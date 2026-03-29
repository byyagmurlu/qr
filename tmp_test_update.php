<?php
require_once __DIR__ . '/backend/api/core/Database.php';
require_once __DIR__ . '/backend/api/models/Setting.php';
require_once __DIR__ . '/backend/api/core/Response.php';

$model = new \Models\Setting();
$body = ['site_title' => 'Test', 'menu_layout' => 'v2'];
try {
    $model->setMany($body, 1);
    echo "Success!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
