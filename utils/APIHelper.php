<?php
/**
 * APIHelper.php - Standardized API Response Handling
 * Ensures consistent API responses across all endpoints
 */

class APIHelper {
    private static $startTime;
    
    /**
     * Initialize response timing
     */
    public static function init() {
        self::$startTime = microtime(true);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
    }

    /**
     * Send success response
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => true,
            'statusCode' => $statusCode,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c'),
            'executionTime' => round((microtime(true) - self::$startTime) * 1000, 2) . 'ms'
        ]);
        exit;
    }

    /**
     * Send error response
     */
    public static function error($message = 'Error', $statusCode = 400, $errors = null) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'statusCode' => $statusCode,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('c'),
            'executionTime' => round((microtime(true) - self::$startTime) * 1000, 2) . 'ms'
        ]);
        exit;
    }

    /**
     * Paginated response
     */
    public static function paginated($data, $total, $page, $limit, $message = 'Success') {
        $totalPages = ceil($total / $limit);
        return [
            'success' => true,
            'statusCode' => 200,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ],
            'timestamp' => date('c'),
            'executionTime' => round((microtime(true) - self::$startTime) * 1000, 2) . 'ms'
        ];
    }

    /**
     * Validate request method
     */
    public static function validateMethod($method) {
        if ($_SERVER['REQUEST_METHOD'] !== $method) {
            self::error("Method {$_SERVER['REQUEST_METHOD']} not allowed", 405);
        }
    }

    /**
     * Get request body
     */
    public static function getRequestBody() {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    /**
     * Validate required fields
     */
    public static function validateRequired($data, $requiredFields) {
        $missing = [];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            self::error('Missing required fields: ' . implode(', ', $missing), 400, $missing);
        }
    }
}
?>
