<?php
/**
 * Orders API - Enhanced with tracking, returns, notifications
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
// GET USER ORDERS WITH STATUS
// ============================================================================

if ($action === 'list') {
    $status = $_GET['status'] ?? null; // all, pending, confirmed, shipped, delivered, cancelled
    
    $query = "
        SELECT o.*, p.name as product_name, p.image_url,
               u.email as user_email, s.name as seller_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN sellers s ON o.seller_id = s.id
        WHERE o.user_id = ?
    ";
    
    $params = [$user_id];
    
    if ($status && $status !== 'all') {
        $query .= " AND o.status = ?";
        $params[] = $status;
    }
    
    $query .= " ORDER BY o.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $types = 'i' . (count($params) > 1 ? 's' : '');
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $orders]);
    exit;
}

// ============================================================================
// GET ORDER DETAILS
// ============================================================================

if ($action === 'get') {
    $order_id = (int)$_GET['id'];
    
    $stmt = $conn->prepare("
        SELECT o.*, p.name as product_name, p.image_url,
               u.email as user_email, s.name as seller_name, s.rating as seller_rating,
               c.code as coupon_code, c.discount_percent
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN sellers s ON o.seller_id = s.id
        LEFT JOIN coupons c ON o.coupon_id = c.id
        WHERE o.id = ? AND o.user_id = ?
    ");
    $stmt->bind_param('ii', $order_id, $user_id);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
    
    if (!$order) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    
    echo json_encode(['success' => true, 'data' => $order]);
    exit;
}

// ============================================================================
// CREATE ORDER (from cart)
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $product_id = (int)$data['product_id'];
    $quantity = (int)$data['quantity'];
    $variant_id = (int)($data['variant_id'] ?? 0);
    $coupon_code = sanitizeInput($data['coupon_code'] ?? '');
    $shipping_address = sanitizeInput($data['shipping_address'] ?? '');
    $payment_method = sanitizeInput($data['payment_method'] ?? 'credit_card');
    
    // Validate coupon if provided
    $coupon_id = null;
    $discount_amount = 0;
    
    if ($coupon_code) {
        $stmt = $conn->prepare("
            SELECT id, discount_percent, discount_amount, min_order_value, valid_to
            FROM coupons
            WHERE code = ? AND is_active = 1 AND valid_to >= CURDATE()
        ");
        $stmt->bind_param('s', $coupon_code);
        $stmt->execute();
        $coupon = $stmt->get_result()->fetch_assoc();
        
        if (!$coupon) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid or expired coupon']);
            exit;
        }
        
        $coupon_id = $coupon['id'];
    }
    
    // Get product details
    $stmt = $conn->prepare("SELECT price, stock_quantity, seller_id FROM products WHERE id = ?");
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    $product = $stmt->get_result()->fetch_assoc();
    
    if (!$product || $product['stock_quantity'] < $quantity) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Insufficient stock']);
        exit;
    }
    
    // Calculate total
    $subtotal = $product['price'] * $quantity;
    
    if ($coupon_id) {
        if ($coupon['discount_percent']) {
            $discount_amount = ($subtotal * $coupon['discount_percent']) / 100;
        } else {
            $discount_amount = $coupon['discount_amount'];
        }
    }
    
    $total = $subtotal - $discount_amount;
    
    // Create order
    $order_number = 'ORD-' . date('Ymdhis') . '-' . rand(1000, 9999);
    $status = 'pending';
    
    $stmt = $conn->prepare("
        INSERT INTO orders 
        (user_id, product_id, quantity, variant_id, order_number, coupon_id, discount_amount, 
         shipping_address, status, payment_token, seller_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $payment_token = bin2hex(random_bytes(16));
    $stmt->bind_param(
        'iiiisidsssi',
        $user_id, $product_id, $quantity, $variant_id ?: null, $order_number,
        $coupon_id, $discount_amount, $shipping_address, $status, $payment_token, $product['seller_id']
    );
    
    if ($stmt->execute()) {
        $order_id = $conn->insert_id;
        
        // Update stock
        $new_stock = $product['stock_quantity'] - $quantity;
        $stmt = $conn->prepare("UPDATE products SET stock_quantity = ? WHERE id = ?");
        $stmt->bind_param('ii', $new_stock, $product_id);
        $stmt->execute();
        
        // Create notification
        $notification_msg = "Order $order_number has been placed. Total: Rs. " . number_format($total, 2);
        $stmt = $conn->prepare("
            INSERT INTO notifications (user_id, type, title, message, related_order_id)
            VALUES (?, 'order_placed', 'Order Placed', ?, ?)
        ");
        $stmt->bind_param('isi', $user_id, $notification_msg, $order_id);
        $stmt->execute();
        
        echo json_encode([
            'success' => true,
            'order_id' => $order_id,
            'order_number' => $order_number,
            'total' => $total,
            'message' => 'Order created successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create order']);
    }
    exit;
}

// ============================================================================
// REQUEST RETURN / REFUND
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'request_return') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $order_id = (int)$data['order_id'];
    $reason = sanitizeInput($data['reason'] ?? '');
    
    $stmt = $conn->prepare("
        UPDATE orders
        SET return_status = 'pending', return_reason = ?
        WHERE id = ? AND user_id = ?
    ");
    $stmt->bind_param('sii', $reason, $order_id, $user_id);
    
    if ($stmt->execute()) {
        // Create notification for admin
        $stmt = $conn->prepare("
            INSERT INTO notifications (user_id, type, title, message, related_order_id)
            VALUES (?, 'return_requested', 'Return Request', ?, ?)
        ");
        $msg = "Return requested for order #$order_id: $reason";
        $stmt->bind_param('isi', $user_id, $msg, $order_id);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Return request submitted']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to request return']);
    }
    exit;
}

// ============================================================================
// TRACK ORDER
// ============================================================================

if ($action === 'track') {
    $order_id = (int)$_GET['id'];
    
    $stmt = $conn->prepare("
        SELECT id, order_number, status, tracking_number, 
               estimated_delivery, actual_delivery, created_at
        FROM orders
        WHERE id = ? AND user_id = ?
    ");
    $stmt->bind_param('ii', $order_id, $user_id);
    $stmt->execute();
    $tracking = $stmt->get_result()->fetch_assoc();
    
    if (!$tracking) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    
    echo json_encode(['success' => true, 'data' => $tracking]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
