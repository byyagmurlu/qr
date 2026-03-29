<?php
// backend/api/controllers/AuthController.php

namespace Controllers;

use Core\Response;
use Core\Auth;
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
        if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
            if ($user) $userModel->incrementLoginAttempts($username);
            Response::error('Kullanıcı adı veya şifre hatalı.', 401);
        }

        $userModel->updateLastLogin($user['id']);

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
        $userModel = new User();
        $user = $userModel->findById($payload['sub']);
        
        if (!$user) Response::error('Kullanıcı bulunamadı.', 404);
        
        Response::success($user);
    }

    public function changePassword(array $params): void {
        $payload = Auth::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $old = $body['old_password'] ?? '';
        $new = $body['new_password'] ?? '';

        if (!$old || !$new || strlen($new) < 8) {
            Response::error('Eski ve yeni şifre (min 8 karakter) gereklidir.', 422);
        }

        $userModel = new User();
        $user = $userModel->findById($payload['sub']);
        
        // Re-fetch with password hash
        $db = \Core\Database::getInstance();
        $userFull = $db->fetchOne("SELECT * FROM admin_users WHERE id = ?", [$payload['sub']]);
        
        if (!Auth::verifyPassword($old, $user['password_hash'] ?? $userFull['password_hash'])) {
            Response::error('Mevcut şifre hatalı.', 401);
        }

        $hash = Auth::hashPassword($new);
        $userModel->updatePassword($payload['sub'], $hash);

        Response::success([], 'Şifre başarıyla güncellendi.');
    }
}
