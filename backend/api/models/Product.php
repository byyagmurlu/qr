<?php
// backend/api/models/Product.php — PDO compatible

namespace Models;

use Core\Database;

class Product {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByCategorySlug(string $slug, string $lang = 'tr', bool $availableOnly = true): array {
        $avail = $availableOnly ? 'AND p.is_available = 1' : '';
        $products = $this->db->fetchAll("
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            JOIN categories c ON c.id = p.category_id
            WHERE c.slug = ? $avail
            ORDER BY p.sort_order ASC, p.is_featured DESC, p.name ASC
        ", [$slug]);

        return $this->formatAndTranslateProducts($products, $lang);
    }

    public function getAllPublic(string $lang = 'tr', bool $availableOnly = true): array {
        $where = $availableOnly ? 'WHERE p.is_available = 1' : '';
        $products = $this->db->fetchAll("
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            JOIN categories c ON c.id = p.category_id
            $where
            ORDER BY c.sort_order ASC, p.sort_order ASC, p.is_featured DESC
        ");
        return $this->formatAndTranslateProducts($products, $lang);
    }

    private function formatAndTranslateProducts(array $products, string $lang): array {
        $transModel = new Translation();
        foreach ($products as &$product) {
            if ($lang !== 'tr') {
                $nameTrans = $transModel->get($lang, 'product', $product['id'], 'name');
                $descTrans = $transModel->get($lang, 'product', $product['id'], 'description');
                $servingTrans = $transModel->get($lang, 'product', $product['id'], 'serving_size');
                
                if ($nameTrans) $product['name'] = $nameTrans;
                if ($descTrans) $product['description'] = $descTrans;
                if ($servingTrans) $product['serving_size'] = $servingTrans;

                // Also translate category name if it exists in the result set
                if (isset($product['category_id'])) {
                    $catNameTrans = $transModel->get($lang, 'category', (int)$product['category_id'], 'name');
                    if ($catNameTrans) $product['category_name'] = $catNameTrans;
                }
            }

            $product['allergens']  = $this->getAllergens($product['id'], $lang);
            $product['nutrition']  = [
                'calories' => $product['calories'],
                'protein'  => $product['protein'],
                'fat'      => $product['fat'],
                'carbs'    => $product['carbs'],
            ];
            $product['image_url']  = $product['image_path']
                ? '/uploads/' . $product['image_path'] : null;
        }
        return $products;
    }

    public function findBySlug(string $slug, string $lang = 'tr'): ?array {
        $product = $this->db->fetchOne("
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            JOIN categories c ON c.id = p.category_id
            WHERE p.slug = ?
        ", [$slug]);
        if (!$product) return null;

        $formatted = $this->formatAndTranslateProducts([$product], $lang);
        return $formatted[0];
    }

    public function findAll(int $page = 1, int $limit = 20, ?int $categoryId = null, string $lang = 'tr'): array {
        $offset = ($page - 1) * $limit;
        $where  = $categoryId ? 'WHERE p.category_id = ?' : '';
        $params = $categoryId ? [$categoryId, $limit, $offset] : [$limit, $offset];

        $products = $this->db->fetchAll("
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            $where
            ORDER BY p.sort_order ASC, p.name ASC
            LIMIT ? OFFSET ?
        ", $params);

        foreach ($products as &$product) {
            $product['allergens'] = $this->getAllergens($product['id'], $lang);
        }

        $countParams = $categoryId ? [$categoryId] : [];
        $countWhere  = $categoryId ? 'WHERE p.category_id = ?' : '';
        $countRow    = $this->db->fetchOne("SELECT COUNT(*) AS total FROM products p $countWhere", $countParams);
        $total = (int)($countRow['total'] ?? 0);

        return [
            'data'       => $products,
            'pagination' => [
                'page'  => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => (int)ceil($total / $limit),
            ],
        ];
    }

    public function findById(int $id, string $lang = 'tr'): ?array {
        $product = $this->db->fetchOne("SELECT * FROM products WHERE id = ?", [$id]);
        if ($product) {
            $product['allergens'] = $this->getAllergens($id, $lang);
        }
        return $product;
    }

    public function syncAllergens(int $productId, array $allergenIds): void {
        $this->db->execute("DELETE FROM product_allergens WHERE product_id = ?", [$productId]);
        foreach ($allergenIds as $aId) {
            $this->setAllergen($productId, (int)$aId, 'trace');
        }
    }

    public function create(array $data): int {
        $slug = $this->generateSlug($data['name']);
        $this->db->query(
            "INSERT INTO products
             (category_id, name, slug, description, detailed_content, price, discount_price,
              is_available, is_featured, preparation_time, serving_size,
              calories, protein, fat, carbs, sort_order, created_by, out_of_stock_text)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['category_id'], $data['name'], $slug,
                $data['description'] ?? null, $data['detailed_content'] ?? null,
                $data['price'], $data['discount_price'] ?? null,
                $data['is_available'] ?? 1, $data['is_featured'] ?? 0,
                $data['preparation_time'] ?? null, $data['serving_size'] ?? null,
                $data['calories'] ?? null, $data['protein'] ?? null,
                $data['fat'] ?? null, $data['carbs'] ?? null,
                $data['sort_order'] ?? 0, $data['created_by'] ?? null,
                $data['out_of_stock_text'] ?? null,
            ]
        );
        $id = $this->db->lastInsertId();

        if (!empty($data['allergen_ids']) && is_array($data['allergen_ids'])) {
            foreach ($data['allergen_ids'] as $aId) {
                $this->setAllergen($id, (int)$aId, 'trace');
            }
        }
        return $id;
    }

    public function update(int $id, array $data): bool {
        $allowed = ['category_id','name','description','detailed_content','price','discount_price',
                    'is_available','is_featured','preparation_time','serving_size',
                    'calories','protein','fat','carbs','sort_order','out_of_stock_text'];
        $fields = [];
        $params = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($fields)) return false;
        $params[] = $id;

        return $this->db->execute(
            "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?",
            $params
        );
    }

    public function delete(int $id): bool {
        return $this->db->execute("DELETE FROM products WHERE id = ?", [$id]);
    }

    public function updateImage(int $id, string $imagePath): bool {
        return $this->db->execute("UPDATE products SET image_path = ? WHERE id = ?", [$imagePath, $id]);
    }

    public function setAllergen(int $productId, int $allergenId, string $severity = 'trace'): void {
        $this->db->query(
            "INSERT OR REPLACE INTO product_allergens (product_id, allergen_id, severity)
             VALUES (?, ?, ?)",
            [$productId, $allergenId, $severity]
        );
    }

    public function removeAllergen(int $productId, int $allergenId): bool {
        return $this->db->execute(
            "DELETE FROM product_allergens WHERE product_id = ? AND allergen_id = ?",
            [$productId, $allergenId]
        );
    }

    private function getAllergens(int $productId, string $lang = 'tr'): array {
        $allergens = $this->db->fetchAll("
            SELECT at.id, at.code, at.name, at.icon_code, pa.severity
            FROM product_allergens pa
            JOIN allergen_types at ON at.id = pa.allergen_id
            WHERE pa.product_id = ?
            ORDER BY at.sort_order ASC
        ", [$productId]);

        if ($lang !== 'tr') {
            $transModel = new Translation();
            foreach ($allergens as &$a) {
                $aTrans = $transModel->get($lang, 'allergen', (int)$a['id'], 'name');
                if ($aTrans) $a['name'] = $aTrans;
            }
        }
        return $allergens;
    }

    private function generateSlug(string $name): string {
        $trMap = ['ç'=>'c','ğ'=>'g','ı'=>'i','ö'=>'o','ş'=>'s','ü'=>'u','Ç'=>'c','Ğ'=>'g','İ'=>'i','Ö'=>'o','Ş'=>'s','Ü'=>'u'];
        $slug = mb_strtolower($name, 'UTF-8');
        $slug = strtr($slug, $trMap);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        return trim($slug, '-') . '-' . substr(uniqid(), -4);
    }
}
