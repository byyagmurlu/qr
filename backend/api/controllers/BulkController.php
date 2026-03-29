<?php
// backend/api/controllers/BulkController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Core\Database;
use Models\Product;
use Models\Category;

class BulkController {

    /** Export products to CSV */
    public function export(array $params): void {
        Auth::requireAuth();
        
        $db = Database::getInstance();
        $products = $db->fetchAll("
            SELECT p.id, c.name as category_name, p.name, p.price, p.description, p.is_available
            FROM products p
            JOIN categories c ON c.id = p.category_id
            ORDER BY c.name, p.name
        ");

        $filename = "stok_listesi_" . date('Y-m-d_H-i') . ".csv";
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        // UTF-8 BOM for Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Header
        fputcsv($output, ['ID', 'Kategori', 'Ürün Adı', 'Fiyat', 'Açıklama', 'Satışta (1/0)'], ';');

        foreach ($products as $p) {
            fputcsv($output, [
                $p['id'],
                $p['category_name'],
                $p['name'],
                $p['price'],
                $p['description'],
                $p['is_available']
            ], ';');
        }

        fclose($output);
        exit;
    }

    /** Download empty sample template */
    public function downloadSample(array $params): void {
        Auth::requireAuth();
        $filename = "qrmenu_sablon_ornegi.csv";

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Header
        fputcsv($output, ['ID', 'Kategori', 'Ürün Adı', 'Fiyat', 'Açıklama', 'Satışta (1/0)'], ';');
        // One sample row
        fputcsv($output, ['', 'Atıştırmalıklar', 'Örnek Patates Kızartması', '45.00', 'Çıtır çıtır taze patatesler', '1'], ';');


        fclose($output);
        exit;
    }

    public function import(array $params): void {
        $payload = Auth::requireAuth();


        
        if (!isset($_FILES['file'])) {
            Response::error('Dosya yüklenmedi. Lütfen bir dosya seçin.', 422);
        }

        try {
            $file = $_FILES['file']['tmp_name'];
            $content = file_get_contents($file);
            if ($content === false) {
                Response::error('Dosya fiziksel olarak okunamıyor.', 500);
            }

            // 1. Remove UTF-8 BOM if it exists
            $bom = chr(0xEF) . chr(0xBB) . chr(0xBF);
            if (str_starts_with($content, $bom)) {
                $content = substr($content, 3);
            }

            // 2. Normalize line endings
            $content = str_replace(["\r\n", "\r"], "\n", $content);

            // 3. Detect delimiter by looking at the first header line
            $lines = explode("\n", $content);
            $headerLine = $lines[0] ?? '';
            if (empty($headerLine)) {
                Response::error('Dosya boş veya formatı hatalı.', 400);
            }
            $delimiter = (str_contains($headerLine, ';')) ? ';' : ',';
            
            // 4. Create models
            $productModel = new Product();
            $categoryModel = new Category();
            $stats = ['updated' => 0, 'created' => 0, 'errors' => 0];

            // 5. Use a temporary stream for professional CSV parsing
            $handle = fopen('php://temp', 'r+');
            fwrite($handle, $content);
            rewind($handle);
            
            // Skip headers
            fgetcsv($handle, 1024, $delimiter);

            while (($data = fgetcsv($handle, 1024, $delimiter)) !== FALSE) {
                // We expect at least Kategori and Urun Adi (columns 2 and 3)
                if (count($data) < 3 || empty($data[1]) || empty($data[2])) {
                    continue; 
                }

                $id           = !empty($data[0]) ? (int)$data[0] : null;
                $catName      = trim($data[1]);
                $prodName     = trim($data[2]);
                $price        = (float)str_replace(',', '.', $data[3] ?? '0');
                $description  = $data[4] ?? '';
                $isAvailable  = isset($data[5]) ? (int)$data[5] : 1;

                if (empty($prodName) || empty($catName)) {
                    $stats['errors']++;
                    continue;
                }

                // Step 1: Manage Category
                $cat = $this->findCategoryByName($categoryModel, $catName);
                if (!$cat) {
                    $catId = $categoryModel->create([
                        'name' => $catName,
                        'created_by' => $payload['sub']
                    ]);
                } else {
                    $catId = $cat['id'];
                }

                // Step 2: Manage Product
                $existing = ($id && $id > 0) ? $productModel->findById($id) : null;
                if (!$existing) {
                    $existing = $this->findProductByName($productModel, $prodName, (int)$catId);
                }

                $updateData = [
                    'category_id'  => $catId,
                    'name'         => $prodName,
                    'price'        => $price,
                    'description'  => $description,
                    'is_available' => $isAvailable
                ];

                if ($existing) {
                    $productModel->update((int)$existing['id'], $updateData);
                    $stats['updated']++;
                } else {
                    $updateData['created_by'] = $payload['sub'];
                    $productModel->create($updateData);
                    $stats['created']++;
                }
            }
            
            fclose($handle);
            Response::success($stats, 'İçe aktarma işlemi tamamlandı.');

        } catch (\Throwable $e) {
            if (isset($handle) && is_resource($handle)) fclose($handle);
            Response::error('Beklenmedik Hata: ' . $e->getMessage(), 500);
        }
    }



    private function findCategoryByName(Category $model, string $name): ?array {
        $db = Database::getInstance();
        return $db->fetchOne("SELECT * FROM categories WHERE name = ?", [$name]);
    }

    private function findProductByName(Product $model, string $name, int $catId): ?array {
        $db = Database::getInstance();
        return $db->fetchOne("SELECT * FROM products WHERE name = ? AND category_id = ?", [$name, $catId]);
    }
}
