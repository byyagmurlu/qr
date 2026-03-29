<?php
// backend/api/models/Category.php — PDO compatible

namespace Models;

use Core\Database;

class Category {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(string $lang = 'tr', bool $activeOnly = true): array {
        $where = $activeOnly ? 'WHERE c.is_active = 1' : '';
        $categories = $this->db->fetchAll("
            SELECT c.*,
                   COUNT(p.id) AS products_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.is_available = 1
            $where
            GROUP BY c.id
            ORDER BY c.sort_order ASC, c.name ASC
        ");

        if ($lang !== 'tr') {
            $transModel = new Translation();
            foreach ($categories as &$cat) {
                 $translation = $transModel->get($lang, 'category', $cat['id'], 'name');
                 if ($translation) $cat['name'] = $translation;
            }
        }

        return $categories;
    }

    public function findById(int $id): ?array {
        return $this->db->fetchOne("SELECT * FROM categories WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug): ?array {
        return $this->db->fetchOne("SELECT * FROM categories WHERE slug = ?", [$slug]);
    }

    public function create(array $data): int {
        $slug = $this->generateSlug($data['name']);
        $this->db->query(
            "INSERT INTO categories (name, slug, description, icon_code, color_code, sort_order, is_active, created_by, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['name'], $slug,
                $data['description'] ?? null, $data['icon_code'] ?? null,
                $data['color_code'] ?? '#2d5016', $data['sort_order'] ?? 0,
                $data['is_active'] ?? 1, $data['created_by'] ?? null,
                $data['image'] ?? null
            ]
        );
        return $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = [];
        $allowed = ['name', 'description', 'icon_code', 'color_code', 'sort_order', 'is_active', 'image'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) return false;
        $params[] = $id;

        return $this->db->execute(
            "UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?",
            $params
        );
    }

    public function delete(int $id): bool {
        return $this->db->execute("DELETE FROM categories WHERE id = ?", [$id]);
    }

    private function generateSlug(string $name): string {
        $trMap = ['ç'=>'c','ğ'=>'g','ı'=>'i','ö'=>'o','ş'=>'s','ü'=>'u','Ç'=>'c','Ğ'=>'g','İ'=>'i','Ö'=>'o','Ş'=>'s','Ü'=>'u'];
        $slug = mb_strtolower($name, 'UTF-8');
        $slug = strtr($slug, $trMap);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        return trim($slug, '-');
    }
}
