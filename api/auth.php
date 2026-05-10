<?php
/**
 * api/auth.php - Secure Authentication API
 * Features: Login, Registration, 2FA, Password Reset, OAuth Ready
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils/APIHelper.php';
require_once __DIR__ . '/../utils/ValidationRules.php';
require_once __DIR__ . '/../utils/SecurityManager.php';

APIHelper::init();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$conn = getDBConnection();
$security = new SecurityManager($conn);

// Rate limiting for auth endpoints (stricter)
$ip = $_SERVER['REMOTE_ADDR'];
if (!$security->checkRateLimit($ip)) {
    APIHelper::error('Too many attempts. Please try again later', 429);
}

switch ($action) {
    case 'register':
        handleRegistration($conn, $security);
        break;
    case 'login':
        handleLogin($conn, $security);
        break;
    case 'logout':
        handleLogout();
        break;
    case 'verify-2fa':
        verify2FA($conn, $security);
        break;
    case 'refresh-token':
        refreshToken($conn, $security);
        break;
    case 'password-reset':
        initiatePasswordReset($conn, $security);
        break;
    case 'confirm-reset':
        confirmPasswordReset($conn, $security);
        break;
    case 'profile':
        getProfile($conn, $security);
        break;
    default:
        APIHelper::error('Invalid action', 400);
}

/**
 * User Registration
 */
function handleRegistration($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    
    // Validate required fields
    APIHelper::validateRequired($data, ['name', 'email', 'password', 'phone']);
    
    // Validate data
    $errors = ValidationRules::validateRegistration($data);
    if (!empty($errors)) {
        APIHelper::error('Validation failed', 400, $errors);
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param('s', $data['email']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        APIHelper::error('Email already registered', 409);
    }

    // Hash password
    $hashedPassword = $security->hashPassword($data['password']);
    
    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, created_at) 
                           VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param('ssss', 
        $data['name'],
        $data['email'],
        $hashedPassword,
        $data['phone']
    );

    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        $token = generateAuthToken($userId, $conn);
        
        APIHelper::success([
            'user_id' => $userId,
            'email' => $data['email'],
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 86400
        ], 'Registration successful', 201);
    } else {
        APIHelper::error('Registration failed', 500);
    }
}

/**
 * User Login
 */
function handleLogin($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    APIHelper::validateRequired($data, ['email', 'password']);

    // Find user
    $stmt = $conn->prepare("SELECT id, name, email, password, two_fa_enabled, two_fa_secret 
                           FROM users WHERE email = ? AND status = 'active'");
    $stmt->bind_param('s', $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $security->logSecurityEvent('LOGIN_FAILED', ['email' => $data['email']], 'WARNING');
        APIHelper::error('Invalid credentials', 401);
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (!$security->verifyPassword($data['password'], $user['password'])) {
        $security->logSecurityEvent('LOGIN_FAILED', ['email' => $data['email']], 'WARNING');
        APIHelper::error('Invalid credentials', 401);
    }

    // Check if 2FA is enabled
    if ($user['two_fa_enabled']) {
        $tempToken = $security->generateSecureToken();
        $_SESSION['2fa_temp_token'] = $tempToken;
        $_SESSION['2fa_user_id'] = $user['id'];
        
        APIHelper::success([
            'requires_2fa' => true,
            'temp_token' => $tempToken
        ], 'Please verify 2FA code');
    }

    // Generate auth token
    $token = generateAuthToken($user['id'], $conn);
    
    $security->logSecurityEvent('LOGIN_SUCCESS', ['user_id' => $user['id']], 'INFO');
    
    APIHelper::success([
        'user_id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => 86400
    ], 'Login successful');
}

/**
 * Logout
 */
function handleLogout() {
    APIHelper::validateMethod('POST');
    
    session_destroy();
    APIHelper::success(null, 'Logged out successfully');
}

/**
 * Verify 2FA Code
 */
function verify2FA($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    APIHelper::validateRequired($data, ['code']);

    if (empty($_SESSION['2fa_user_id'])) {
        APIHelper::error('2FA verification failed', 401);
    }

    $stmt = $conn->prepare("SELECT two_fa_secret FROM users WHERE id = ?");
    $stmt->bind_param('i', $_SESSION['2fa_user_id']);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$security->verify2FACode($user['two_fa_secret'], $data['code'])) {
        APIHelper::error('Invalid 2FA code', 401);
    }

    $token = generateAuthToken($_SESSION['2fa_user_id'], $conn);
    unset($_SESSION['2fa_user_id']);
    unset($_SESSION['2fa_temp_token']);

    APIHelper::success([
        'token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => 86400
    ], '2FA verification successful');
}

/**
 * Generate Auth Token
 */
function generateAuthToken($userId, $conn) {
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+1 day'));
    
    $stmt = $conn->prepare("INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $userId, $token, $expiry);
    $stmt->execute();
    
    return $token;
}

/**
 * Refresh Token
 */
function refreshToken($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $token = getBearerToken();
    if (!$token) {
        APIHelper::error('No token provided', 401);
    }

    $stmt = $conn->prepare("SELECT user_id FROM auth_tokens WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows === 0) {
        APIHelper::error('Invalid or expired token', 401);
    }

    $user = $stmt->get_result()->fetch_assoc();
    $newToken = generateAuthToken($user['user_id'], $conn);

    APIHelper::success([
        'token' => $newToken,
        'token_type' => 'Bearer',
        'expires_in' => 86400
    ], 'Token refreshed');
}

/**
 * Initiate Password Reset
 */
function initiatePasswordReset($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    APIHelper::validateRequired($data, ['email']);

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param('s', $data['email']);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows === 0) {
        APIHelper::success(null, 'If email exists, reset link sent');
        return;
    }

    $user = $stmt->get_result()->fetch_assoc();
    $resetToken = $security->generateSecureToken();
    
    $stmt = $conn->prepare("INSERT INTO password_resets (user_id, token, expires_at) 
                           VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))");
    $stmt->bind_param('is', $user['id'], $resetToken);
    $stmt->execute();

    // Send email with reset link (implement actual email sending)
    $resetLink = "https://yourdomain.com/reset-password?token=$resetToken";
    
    APIHelper::success(null, 'Password reset link sent');
}

/**
 * Confirm Password Reset
 */
function confirmPasswordReset($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    APIHelper::validateRequired($data, ['token', 'new_password']);

    $stmt = $conn->prepare("SELECT user_id FROM password_resets 
                           WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param('s', $data['token']);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows === 0) {
        APIHelper::error('Invalid or expired reset token', 401);
    }

    $reset = $stmt->get_result()->fetch_assoc();
    $hashedPassword = $security->hashPassword($data['new_password']);

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param('si', $hashedPassword, $reset['user_id']);
    
    if ($stmt->execute()) {
        $conn->query("DELETE FROM password_resets WHERE token = ?");
        APIHelper::success(null, 'Password reset successful');
    } else {
        APIHelper::error('Password reset failed', 500);
    }
}

/**
 * Get User Profile
 */
function getProfile($conn, $security) {
    $token = getBearerToken();
    if (!$token) {
        APIHelper::error('No token provided', 401);
    }

    $stmt = $conn->prepare("SELECT user_id FROM auth_tokens WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $tokenData = $stmt->get_result()->fetch_assoc();
    
    if (!$tokenData) {
        APIHelper::error('Invalid token', 401);
    }

    $stmt = $conn->prepare("SELECT id, name, email, phone, created_at FROM users WHERE id = ?");
    $stmt->bind_param('i', $tokenData['user_id']);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    APIHelper::success($user, 'Profile retrieved');
}

/**
 * Get Bearer Token from header
 */
function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

$conn->close();
?>
