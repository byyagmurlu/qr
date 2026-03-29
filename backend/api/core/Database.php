<?php
// backend/api/core/Database.php
// PDO tabanlı — SQLite (yerel) ve MySQL (cPanel) destekler.

namespace Core;

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;
    private string $driver;

    private function __construct() {
        require_once dirname(__DIR__) . '/config/config.php';

        $this->driver = DB_DRIVER;

        try {
            if ($this->driver === 'sqlite') {
                $dir = dirname(DB_SQLITE_PATH);
                if (!is_dir($dir)) mkdir($dir, 0755, true);

                $this->pdo = new \PDO('sqlite:' . DB_SQLITE_PATH);
                $this->pdo->exec('PRAGMA journal_mode=WAL;');
                $this->pdo->exec('PRAGMA foreign_keys=ON;');
            } else {
                $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
                $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
            }

            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            $this->pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);

        } catch (\PDOException $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error'   => 'Veritabanı bağlantı hatası.',
                'detail'  => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }

    public function getDriver(): string {
        return $this->driver;
    }

    /** Execute a prepared statement and return the PDOStatement */
    public function query(string $sql, array $params = []): \PDOStatement {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /** Fetch all matching rows as associative arrays */
    public function fetchAll(string $sql, array $params = []): array {
        return $this->query($sql, $params)->fetchAll();
    }

    /** Fetch a single row, or null */
    public function fetchOne(string $sql, array $params = []): ?array {
        $row = $this->query($sql, $params)->fetch();
        return $row !== false ? $row : null;
    }

    /** Execute a DML statement, return true if any rows were affected */
    public function execute(string $sql, array $params = []): bool {
        return $this->query($sql, $params)->rowCount() > 0;
    }

    /** Return the last inserted auto-increment id */
    public function lastInsertId(): int {
        return (int) $this->pdo->lastInsertId();
    }
}
