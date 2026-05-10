<?php
/**
 * SecurityManager.php - Comprehensive Security Layer
 * Handles: Rate limiting, input validation, authentication, encryption
 */

class SecurityManager {
    private $db;
    private $rateLimit = 100; // requests per minute
    private $rateLimitWindow = 60; // seconds

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Rate limiting check
     */
    public function checkRateLimit($ip) {
        $key = 'rate_' . $ip;
        $count = apcu_fetch($key);
        
        if ($count === false) {
            apcu_store($key, 1, $this->rateLimitWindow);
            return true;
        }
        
        if ($count >= $this->rateLimit) {
            http_response_code(429);
            return false;
        }
        
        apcu_inc($key);
        return true;
    }

    /**
     * Generate secure token
     */
    public function generateSecureToken($length = 32) {
        return bin2hex(random_bytes($length / 2));
    }

    /**
     * Hash password with bcrypt
     */
    public function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Verify password
     */
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Validate email format
     */
    public function validateEmail($email) {
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        return $email !== false;
    }

    /**
     * Sanitize HTML output
     */
    public function sanitizeOutput($data) {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeOutput'], $data);
        }
        return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }

    /**
     * SQL injection prevention
     */
    public function escapeSQLString($input) {
        return $this->db->real_escape_string($input);
    }

    /**
     * XSS Prevention
     */
    public function preventXSS($data) {
        return htmlspecialchars(strip_tags($data), ENT_QUOTES, 'UTF-8');
    }

    /**
     * CSRF Token Generation
     */
    public function generateCSRFToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = $this->generateSecureToken();
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Verify CSRF Token
     */
    public function verifyCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && 
               hash_equals($_SESSION['csrf_token'], $token);
    }

    /**
     * Encrypt sensitive data
     */
    public function encryptData($data, $key) {
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
        return base64_encode($iv . $encrypted);
    }

    /**
     * Decrypt sensitive data
     */
    public function decryptData($encrypted, $key) {
        $data = base64_decode($encrypted);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
    }

    /**
     * Log security events
     */
    public function logSecurityEvent($event, $details, $severity = 'INFO') {
        $logFile = __DIR__ . '/../logs/security.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
        $logEntry = "[$timestamp] [$severity] [$ip] $event: " . json_encode($details) . "\n";
        
        if (!file_exists(dirname($logFile))) {
            mkdir(dirname($logFile), 0755, true);
        }
        error_log($logEntry, 3, $logFile);
    }

    /**
     * Implement 2FA
     */
    public function generate2FASecret() {
        require_once __DIR__ . '/vendor/autoload.php';
        $google2fa = new \PragmaRX\Google2FA\Google2FA();
        return $google2fa->generateSecretKey();
    }

    /**
     * Verify 2FA code
     */
    public function verify2FACode($secret, $code) {
        require_once __DIR__ . '/vendor/autoload.php';
        $google2fa = new \PragmaRX\Google2FA\Google2FA();
        return $google2fa->verifyKey($secret, $code);
    }
}
?>
