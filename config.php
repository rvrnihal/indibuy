<?php
/**
 * Application Configuration - Deployment Ready
 * Loads environment variables and initializes database connection
 * Auto-creates necessary directories on first run
 */

// Create logs directory if it doesn't exist
if (!is_dir(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}

// Load .env file if it exists
if (file_exists(__DIR__ . '/.env')) {
    $envLines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($envLines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Database Configuration
define('DB_HOST', $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost');
define('DB_USER', $_ENV['DB_USER'] ?? getenv('DB_USER') ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?? '');
define('DB_NAME', $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?? 'paymentdb');
define('APP_ENV', $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'development');
define('APP_ROOT', __DIR__);

// Error handling
if (APP_ENV === 'production') {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/errors.log');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/errors.log');
}

// CSRF Token Configuration
define('CSRF_TOKEN_LENGTH', $_ENV['CSRF_TOKEN_LENGTH'] ?? 32);

// Session configuration
session_set_cookie_params([
    'httponly' => true,
    'secure' => (APP_ENV === 'production'),
    'samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Get database connection
 * Uses prepared statements for security
 * Better error handling for deployment
 */
function getDBConnection() {
    static $conn = null;
    
    // Return cached connection
    if ($conn !== null) {
        return $conn;
    }
    
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        
        if (APP_ENV === 'production') {
            http_response_code(503);
            die(json_encode([
                'success' => false,
                'statusCode' => 503,
                'message' => 'Service temporarily unavailable'
            ]));
        } else {
            http_response_code(500);
            die(json_encode([
                'success' => false,
                'statusCode' => 500,
                'message' => 'Database connection failed: ' . $conn->connect_error,
                'debug' => [
                    'host' => DB_HOST,
                    'user' => DB_USER,
                    'database' => DB_NAME
                ]
            ]));
        }
    }
    
    $conn->set_charset("utf8mb4");
    
    // Enable error mode for better debugging
    if (APP_ENV !== 'production') {
        $conn->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
    }
    
    return $conn;
}

/**
 * Generate CSRF token
 */
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(CSRF_TOKEN_LENGTH / 2));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Sanitize input
 */
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate password strength
 */
function isStrongPassword($password) {
    return strlen($password) >= 8 && 
           preg_match('/[A-Z]/', $password) && 
           preg_match('/[a-z]/', $password) && 
           preg_match('/[0-9]/', $password);
}
?>
