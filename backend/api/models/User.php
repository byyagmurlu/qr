<?php
// backend/api/models/User.php — PDO compatible

namespace Models;

use Core\Database;

class User {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByUsername(string $username): ?array {
        return $this->db->fetchOne(
            "SELECT * FROM admin_users WHERE username = ? AND is_active = 1",
            [$username]
        );
    }

    public function findById(int $id): ?array {
        return $this->db->fetchOne(
            "SELECT id, username, email, full_name, role, is_active, last_login, created_at
             FROM admin_users WHERE id = ?",
            [$id]
        );
    }

    public function findAll(): array {
        return $this->db->fetchAll(
            "SELECT id, username, email, full_name, role, is_active, last_login, created_at
             FROM admin_users ORDER BY created_at DESC"
        );
    }

    public function updateLastLogin(int $id): void {
        $this->db->execute(
            "UPDATE admin_users SET last_login = datetime('now'), login_attempts = 0 WHERE id = ?",
            [$id]
        );
    }

    public function incrementLoginAttempts(string $username): void {
        $this->db->execute(
            "UPDATE admin_users SET login_attempts = login_attempts + 1 WHERE username = ?",
            [$username]
        );
    }

    public function updatePassword(int $id, string $hash): bool {
        return $this->db->execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [$hash, $id]);
    }

    public function create(array $data): int {
        $this->db->query(
            "INSERT INTO admin_users (username, email, password_hash, salt, full_name, role)
             VALUES (?, ?, ?, ?, ?, ?)",
            [$data['username'], $data['email'], $data['password_hash'], $data['salt'] ?? '',
             $data['full_name'] ?? '', $data['role'] ?? 'editor']
        );
        return $this->db->lastInsertId();
    }
}
