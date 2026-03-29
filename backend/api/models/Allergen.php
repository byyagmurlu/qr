<?php
// backend/api/models/Allergen.php — PDO compatible

namespace Models;

use Core\Database;

class Allergen {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(bool $activeOnly = true): array {
        $where = $activeOnly ? 'WHERE is_active = 1' : '';
        return $this->db->fetchAll("SELECT * FROM allergen_types $where ORDER BY sort_order ASC");
    }

    public function findById(int $id): ?array {
        return $this->db->fetchOne("SELECT * FROM allergen_types WHERE id = ?", [$id]);
    }

    public function create(array $data): int {
        $this->db->query(
            "INSERT INTO allergen_types (code, name, icon_code, description, sort_order)
             VALUES (?, ?, ?, ?, ?)",
            [$data['code'], $data['name'], $data['icon_code'] ?? null, $data['description'] ?? null, $data['sort_order'] ?? 0]
        );
        return $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = [];
        foreach (['code','name','icon_code','description','sort_order','is_active'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) return false;
        $params[] = $id;
        return $this->db->execute(
            "UPDATE allergen_types SET " . implode(', ', $fields) . " WHERE id = ?",
            $params
        );
    }

    public function delete(int $id): bool {
        return $this->db->execute("DELETE FROM allergen_types WHERE id = ?", [$id]);
    }
}
