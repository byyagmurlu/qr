<?php
// backend/api/models/Setting.php — PDO compatible

namespace Models;

use Core\Database;

class Setting {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(string $lang = 'tr'): array {
        $rows   = $this->db->fetchAll("SELECT id, setting_key, setting_value, setting_type FROM site_settings WHERE is_editable = 1 ORDER BY id ASC");
        $result = [];
        foreach ($rows as $row) {
            $val = $this->castValue($row['setting_value'], $row['setting_type']);
            
            if ($lang !== 'tr') {
                $trans = $this->db->fetchOne(
                    "SELECT translation_text FROM translations WHERE entity_type = 'setting' AND entity_id = ? AND language_code = ? AND field_name = ?",
                    [$row['id'], $lang, $row['setting_key']]
                );
                if ($trans) $val = $trans;
            }

            $result[$row['setting_key']] = $val;
        }
        return $result;
    }

    public function get(string $key, string $lang = 'tr'): mixed {
        $row = $this->db->fetchOne("SELECT id, setting_value, setting_type FROM site_settings WHERE setting_key = ?", [$key]);
        if (!$row) return null;
        
        $val = $this->castValue($row['setting_value'], $row['setting_type']);
        if ($lang !== 'tr') {
            $trans = $this->db->fetchOne(
                "SELECT translation_text FROM translations WHERE entity_type = 'setting' AND entity_id = ? AND language_code = ? AND field_name = ?",
                [$row['id'], $lang, $key]
            );
            if ($trans) $val = $trans;
        }
        return $val;
    }


    public function set(string $key, mixed $value, ?int $adminId = null): bool {
        $strVal = is_array($value) ? json_encode($value) : (string)$value;
        $check = $this->db->fetchOne("SELECT id FROM site_settings WHERE setting_key = ?", [$key]);
        if ($check) {
            return $this->db->execute(
                "UPDATE site_settings SET setting_value = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?",
                [$strVal, $adminId, $key]
            );
        } else {
            return $this->db->execute(
                "INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?)",
                [$key, $strVal, $adminId]
            );
        }
    }

    public function setMany(array $settings, ?int $adminId = null): void {
        foreach ($settings as $key => $value) {
            $this->set($key, $value, $adminId);
        }
    }

    private function castValue(mixed $value, string $type): mixed {
        return match($type) {
            'number'  => (float)$value,
            'boolean' => (bool)$value,
            'json'    => json_decode($value, true),
            default   => $value,
        };
    }
}
