<?php
// backend/api/core/Response.php

namespace Core;

class Response {
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        
        // Handle CORS (Cross-Origin Resource Sharing)
        header('Access-Control-Allow-Origin: *'); 
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error($message, $statusCode = 400) {
        self::json([
            'success' => false,
            'error' => $message
        ], $statusCode);
    }

    public static function success($data = [], $message = null, $statusCode = 200) {
        $response = [
            'success' => true
        ];
        
        if ($message !== null) {
             $response['message'] = $message;
        }

        // Always include 'data' if it's explicitly passed (even if empty array)
        $response['data'] = $data;

        self::json($response, $statusCode);
    }
}
