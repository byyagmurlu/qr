<?php
// backend/api/models/Translation.php

namespace Models;

use Core\Database;

class Translation {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function get(string $lang, string $entityType, int $entityId, string $fieldName): ?string {
        $row = $this->db->fetchOne(
            "SELECT translation_text FROM translations 
             WHERE language_code = ? AND entity_type = ? AND entity_id = ? AND field_name = ?",
            [$lang, $entityType, $entityId, $fieldName]
        );
        return $row ? $row['translation_text'] : null;
    }

    public function set(string $lang, string $entityType, int $entityId, string $fieldName, string $text): bool {
        // SQLite doesn't have native ON DUPLICATE KEY UPDATE in all versions without careful indexing
        // but it has INSERT OR REPLACE (works if we have a UNIQUE constraint)
        // For simplicity:
        $this->db->execute(
            "DELETE FROM translations WHERE language_code = ? AND entity_type = ? AND entity_id = ? AND field_name = ?",
            [$lang, $entityType, $entityId, $fieldName]
        );
        return $this->db->execute(
            "INSERT INTO translations (language_code, entity_type, entity_id, field_name, translation_text) VALUES (?, ?, ?, ?, ?)",
            [$lang, $entityType, $entityId, $fieldName, $text]
        );
    }

    public function getAllForEntity(string $entityType, int $entityId): array {
        return $this->db->fetchAll(
            "SELECT * FROM translations WHERE entity_type = ? AND entity_id = ?",
            [$entityType, $entityId]
        );
    }
}
