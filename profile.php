<?php
/**
 * User Profile & Account Management
 */

require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$user_id = $_SESSION['user_id'];

// ============================================================================
// GET PROFILE
// ============================================================================

if ($action === 'profile') {
    $stmt = $conn->prepare("SELECT id, email, name, created_at FROM users WHERE id = ?");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    
    // Get saved addresses
    $stmt = $conn->prepare("
        SELECT id, type, name, phone, street_address, city, state, postal_code, 
               country, is_default
        FROM user_addresses
        WHERE user_id = ?
        ORDER BY is_default DESC
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $addresses = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get saved payment methods
    $stmt = $conn->prepare("
        SELECT id, method_type, method_name, last_four_digits, is_default, provider
        FROM payment_methods
        WHERE user_id = ?
        ORDER BY is_default DESC
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $payment_methods = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get order statistics
    $stmt = $conn->prepare("
        SELECT COUNT(*) as total_orders, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders
        FROM orders
        WHERE user_id = ?
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $stats = $stmt->get_result()->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'addresses' => $addresses,
        'payment_methods' => $payment_methods,
        'stats' => $stats
    ]);
    exit;
}

// ============================================================================
// UPDATE PROFILE
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = sanitizeInput($data['name'] ?? '');
    
    $stmt = $conn->prepare("UPDATE users SET name = ? WHERE id = ?");
    $stmt->bind_param('si', $name, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update']);
    }
    exit;
}

// ============================================================================
// ADD ADDRESS
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_address') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $type = sanitizeInput($data['type'] ?? 'home');
    $name = sanitizeInput($data['name'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $street = sanitizeInput($data['street_address'] ?? '');
    $city = sanitizeInput($data['city'] ?? '');
    $state = sanitizeInput($data['state'] ?? '');
    $postal = sanitizeInput($data['postal_code'] ?? '');
    $country = sanitizeInput($data['country'] ?? 'India');
    $is_default = (int)($data['is_default'] ?? 0);
    
    // If setting as default, unset others
    if ($is_default) {
        $stmt = $conn->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
    }
    
    $stmt = $conn->prepare("
        INSERT INTO user_addresses 
        (user_id, type, name, phone, street_address, city, state, postal_code, country, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        'issssssssi',
        $user_id, $type, $name, $phone, $street, $city, $state, $postal, $country, $is_default
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Address added']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add address']);
    }
    exit;
}

// ============================================================================
// DELETE ADDRESS
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_address') {
    $data = json_decode(file_get_contents('php://input'), true);
    $address_id = (int)$data['id'];
    
    $stmt = $conn->prepare("DELETE FROM user_addresses WHERE id = ? AND user_id = ?");
    $stmt->bind_param('ii', $address_id, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Address deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete']);
    }
    exit;
}

// ============================================================================
// ADD PAYMENT METHOD
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_payment') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $method_type = sanitizeInput($data['method_type'] ?? '');
    $method_name = sanitizeInput($data['method_name'] ?? '');
    $last_four = sanitizeInput($data['last_four_digits'] ?? '');
    $provider = sanitizeInput($data['provider'] ?? '');
    $is_default = (int)($data['is_default'] ?? 0);
    
    // If setting as default, unset others
    if ($is_default) {
        $stmt = $conn->prepare("UPDATE payment_methods SET is_default = 0 WHERE user_id = ?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
    }
    
    $stmt = $conn->prepare("
        INSERT INTO payment_methods 
        (user_id, method_type, method_name, last_four_digits, provider, is_default)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param('issssi', $user_id, $method_type, $method_name, $last_four, $provider, $is_default);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Payment method added']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add payment method']);
    }
    exit;
}

// ============================================================================
// CHANGE PASSWORD
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'change_password') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $current_password = $data['current_password'] ?? '';
    $new_password = $data['new_password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';
    
    if (!isStrongPassword($new_password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Password not strong enough']);
        exit;
    }
    
    if ($new_password !== $confirm_password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit;
    }
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    
    if (!password_verify($current_password, $user['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
        exit;
    }
    
    // Update password
    $hashed = password_hash($new_password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param('si', $hashed, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to change password']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
