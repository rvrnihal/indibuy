<?php
/**
 * Coupons & Discounts API
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// ============================================================================
// VALIDATE COUPON
// ============================================================================

if ($action === 'validate') {
    $code = sanitizeInput($_GET['code'] ?? '');
    $order_total = (float)($_GET['total'] ?? 0);
    
    if (!$code) {
        echo json_encode(['success' => false, 'message' => 'No coupon code provided']);
        exit;
    }
    
    $stmt = $conn->prepare("
        SELECT id, code, discount_percent, discount_amount, min_order_value, 
               max_uses, current_uses, valid_to, applicable_categories
        FROM coupons
        WHERE code = ? AND is_active = 1 AND valid_to >= CURDATE()
    ");
    $stmt->bind_param('s', $code);
    $stmt->execute();
    $coupon = $stmt->get_result()->fetch_assoc();
    
    if (!$coupon) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired coupon']);
        exit;
    }
    
    // Check usage limits
    if ($coupon['max_uses'] && $coupon['current_uses'] >= $coupon['max_uses']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Coupon usage limit exceeded']);
        exit;
    }
    
    // Check minimum order value
    if ($coupon['min_order_value'] && $order_total < $coupon['min_order_value']) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Minimum order value: Rs. ' . $coupon['min_order_value']
        ]);
        exit;
    }
    
    // Calculate discount
    if ($coupon['discount_percent']) {
        $discount = ($order_total * $coupon['discount_percent']) / 100;
    } else {
        $discount = $coupon['discount_amount'];
    }
    
    echo json_encode([
        'success' => true,
        'coupon_id' => $coupon['id'],
        'code' => $coupon['code'],
        'discount_type' => $coupon['discount_percent'] ? 'percent' : 'fixed',
        'discount_value' => $coupon['discount_percent'] ?? $coupon['discount_amount'],
        'discount_amount' => $discount,
        'final_total' => $order_total - $discount
    ]);
    exit;
}

// ============================================================================
// GET ACTIVE FLASH SALES
// ============================================================================

if ($action === 'flash_sales') {
    $stmt = $conn->prepare("
        SELECT id, title, description, discount_percent, start_time, end_time,
               max_quantity_per_user, current_orders
        FROM flash_sales
        WHERE is_active = 1 AND end_time > NOW()
        ORDER BY end_time ASC
    ");
    $stmt->execute();
    $sales = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $sales]);
    exit;
}

// ============================================================================
// GET COUPONS FOR USER
// ============================================================================

if ($action === 'available') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("
        SELECT c.id, c.code, c.discount_percent, c.discount_amount, 
               c.min_order_value, c.valid_to,
               CASE WHEN cu.id IS NOT NULL THEN 1 ELSE 0 END as already_used
        FROM coupons c
        LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id AND cu.user_id = ?
        WHERE c.is_active = 1 AND c.valid_to >= CURDATE()
        AND (c.max_uses IS NULL OR c.current_uses < c.max_uses)
        ORDER BY c.valid_to ASC
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $coupons = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $coupons]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
