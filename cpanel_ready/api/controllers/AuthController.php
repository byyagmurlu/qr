<?php
// backend/api/controllers/AuthController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
use Core\Database;
use Models\User;

class AuthController {

    public function login(array $params): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';

        if (!$username || !$password) {
            Response::error('Kullanıcı adı ve şifre gereklidir.', 422);
        }

        $userModel = new User();
        $user = $userModel->findByUsername($username);

        // Brute-force koruması: 5 başarısız denemeden sonra 15 dk kilitle
        if ($user && !empty($user['locked_until'])) {
            if (strtotime($user['locked_until']) > time()) {
                $remaining = ceil((strtotime($user['locked_until']) - time()) / 60);
                Response::error("Hesap geçici olarak kilitlendi. {$remaining} dakika sonra tekrar deneyin.", 429);
            }
        }

        if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
            if ($user) {
                $attempts = ($user['login_attempts'] ?? 0) + 1;
                $db = Database::getInstance();
                if ($attempts >= 5) {
                    $lockedUntil = date('Y-m-d H:i:s', time() + 900); // 15 dakika
                    $db->execute(
                        "UPDATE admin_users SET login_attempts = ?, locked_until = ? WHERE id = ?",
                        [$attempts, $lockedUntil, $user['id']]
                    );
                } else {
                    $db->execute(
                        "UPDATE admin_users SET login_attempts = ? WHERE id = ?",
                        [$attempts, $user['id']]
                    );
                }
            }
            Response::error('Kullanıcı adı veya şifre hatalı.', 401);
        }

        // Başarılı giriş: sayacı sıfırla
        $db = Database::getInstance();
        $db->execute(
            "UPDATE admin_users SET login_attempts = 0, locked_until = NULL, last_login = ? WHERE id = ?",
            [date('Y-m-d H:i:s'), $user['id']]
        );

        $token = Auth::generateToken([
            'sub'      => $user['id'],
            'username' => $user['username'],
            'role'     => $user['role'],
        ]);

        Response::success([
            'token' => $token,
            'admin' => [
                'id'        => $user['id'],
                'username'  => $user['username'],
                'email'     => $user['email'],
                'full_name' => $user['full_name'],
                'role'      => $user['role'],
            ]
        ]);
    }

    public function me(array $params): void {
        $payload = Auth::requireAuth();
        $db = Database::getInstance();
        $user = $db->fetchOne(
            "SELECT id, username, email, full_name, role, last_login, created_at FROM admin_users WHERE id = ?",
            [$payload['sub']]
        );
        if (!$user) Response::error('Kullanıcı bulunamadı.', 404);
        Response::success($user);
    }

    public function updateProfile(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $fullName = trim($body['full_name'] ?? '');
        $email    = trim($body['email'] ?? '');

        if (!$fullName || !$email) {
            Response::error('Ad Soyad ve e-posta zorunludur.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Geçerli bir e-posta adresi girin.', 422);
        }

        $db = Database::getInstance();

        // E-posta başka kullanıcıda var mı?
        $existing = $db->fetchOne(
            "SELECT id FROM admin_users WHERE email = ? AND id != ?",
            [$email, $payload['sub']]
        );
        if ($existing) {
            Response::error('Bu e-posta adresi zaten kullanılıyor.', 409);
        }

        $db->execute(
            "UPDATE admin_users SET full_name = ?, email = ? WHERE id = ?",
            [$fullName, $email, $payload['sub']]
        );

        Response::success([], 'Profil güncellendi.');
    }

    public function changePassword(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $old     = $body['old_password']     ?? '';
        $new     = $body['new_password']     ?? '';
        $confirm = $body['confirm_password'] ?? '';

        if (!$old || !$new) {
            Response::error('Eski ve yeni şifre gereklidir.', 422);
        }
        if (strlen($new) < 8) {
            Response::error('Yeni şifre en az 8 karakter olmalıdır.', 422);
        }
        if ($new !== $confirm) {
            Response::error('Yeni şifreler eşleşmiyor.', 422);
        }
        // Güçlü şifre: büyük harf + rakam zorunlu
        if (!preg_match('/[A-Z]/', $new) || !preg_match('/[0-9]/', $new)) {
            Response::error('Şifre en az bir büyük harf ve bir rakam içermelidir.', 422);
        }

        $db = Database::getInstance();
        $userFull = $db->fetchOne("SELECT * FROM admin_users WHERE id = ?", [$payload['sub']]);

        if (!$userFull || !Auth::verifyPassword($old, $userFull['password_hash'])) {
            Response::error('Mevcut şifre hatalı.', 401);
        }

        $hash = Auth::hashPassword($new); // bcrypt cost=12
        $db->execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [$hash, $payload['sub']]);

        Response::success([], 'Şifre başarıyla güncellendi.');
    }
}
