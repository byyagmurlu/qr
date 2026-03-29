<?php
// backend/api/models/Language.php 

namespace Models;

use Core\Database;

class Language {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(bool $activeOnly = true): array {
        $where = $activeOnly ? 'WHERE is_active = 1' : '';
        return $this->db->fetchAll("SELECT * FROM languages $where ORDER BY is_default DESC, name ASC");
    }

    public function findByCode(string $code): ?array {
        return $this->db->fetchOne("SELECT * FROM languages WHERE code = ?", [$code]);
    }
}
