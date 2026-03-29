<?php
// backend/api/core/Auth.php

namespace Core;

class Auth {
    
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function generateToken(array $payload): string {
        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        
        $payload['iat'] = time();
        $payload['exp'] = time() + (60 * 60 * 24 * 7); // 7 days
        
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        $signature = self::base64UrlEncode(hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true));

        return "$header.$payloadEncoded.$signature";
    }

    public static function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;
        
        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
        
        if (!hash_equals($expectedSignature, $signature)) return null;

        $data = json_decode(self::base64UrlDecode($payload), true);

        if (!$data || $data['exp'] < time()) return null;

        return $data;
    }

    public static function getTokenFromHeader(): ?string {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if ($auth && str_starts_with($auth, 'Bearer ')) {
            return substr($auth, 7);
        }
        return null;
    }

    public static function requireAuth(): array {
        $token = self::getTokenFromHeader() ?? $_GET['token'] ?? null;
        
        if (!$token) {
            Response::error('Yetkisiz erişim. Token gereklidir.', 401);
        }

        $payload = self::verifyToken($token);
        
        if (!$payload) {
            Response::error('Geçersiz veya süresi dolmuş token.', 401);
        }

        return $payload;
    }

    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}
