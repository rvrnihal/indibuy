<?php
/**
 * Admin Dashboard API
 */

require_once 'config.php';

// Check admin authentication
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Admin not authenticated']);
    exit;
}

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

if ($action === 'stats') {
    $period = $_GET['period'] ?? 'today'; // today, week, month, year
    
    // Determine date range
    $date_sql = "DATE(created_at)";
    $date_condition = "DATE(created_at) = CURDATE()";
    
    if ($period === 'week') {
        $date_condition = "YEARWEEK(created_at) = YEARWEEK(NOW())";
    } elseif ($period === 'month') {
        $date_condition = "DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')";
    } elseif ($period === 'year') {
        $date_condition = "YEAR(created_at) = YEAR(NOW())";
    }
    
    // Total orders
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM orders WHERE $date_condition");
    $stmt->execute();
    $total_orders = $stmt->get_result()->fetch_assoc()['count'];
    
    // Total revenue
    $stmt = $conn->prepare("
        SELECT SUM(o.quantity * p.price - o.discount_amount) as revenue
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE $date_condition
    ");
    $stmt->execute();
    $revenue = $stmt->get_result()->fetch_assoc()['revenue'] ?? 0;
    
    // New users
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE $date_condition");
    $stmt->execute();
    $new_users = $stmt->get_result()->fetch_assoc()['count'];
    
    // Active users
    $stmt = $conn->prepare("
        SELECT COUNT(DISTINCT user_id) as count FROM user_sessions 
        WHERE $date_condition
    ");
    $stmt->execute();
    $active_users = $stmt->get_result()->fetch_assoc()['count'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'total_orders' => $total_orders,
            'revenue' => (float)$revenue,
            'new_users' => $new_users,
            'active_users' => $active_users
        ]
    ]);
    exit;
}

// ============================================================================
// TOP PRODUCTS
// ============================================================================

if ($action === 'top_products') {
    $limit = (int)($_GET['limit'] ?? 10);
    
    $stmt = $conn->prepare("
        SELECT p.id, p.name, p.image_url, 
               COUNT(o.id) as order_count,
               SUM(o.quantity) as total_sold,
               AVG(p.rating) as avg_rating
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT ?
    ");
    $stmt->bind_param('i', $limit);
    $stmt->execute();
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $products]);
    exit;
}

// ============================================================================
// RECENT ORDERS
// ============================================================================

if ($action === 'recent_orders') {
    $limit = (int)($_GET['limit'] ?? 20);
    
    $stmt = $conn->prepare("
        SELECT o.id, o.order_number, o.status, o.quantity,
               u.email as user_email, p.name as product_name,
               o.created_at, o.payment_token
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
        LIMIT ?
    ");
    $stmt->bind_param('i', $limit);
    $stmt->execute();
    $orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $orders]);
    exit;
}

// ============================================================================
// MANAGE COUPONS
// ============================================================================

if ($action === 'coupons') {
    $stmt = $conn->prepare("
        SELECT id, code, discount_percent, discount_amount, valid_to,
               max_uses, current_uses, is_active
        FROM coupons
        ORDER BY valid_to DESC
    ");
    $stmt->execute();
    $coupons = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $coupons]);
    exit;
}

// ============================================================================
// CREATE COUPON
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create_coupon') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $code = strtoupper(sanitizeInput($data['code'] ?? ''));
    $discount_percent = (float)($data['discount_percent'] ?? 0);
    $discount_amount = (float)($data['discount_amount'] ?? 0);
    $min_order_value = (float)($data['min_order_value'] ?? 0);
    $max_uses = (int)($data['max_uses'] ?? null);
    $valid_to = sanitizeInput($data['valid_to'] ?? '');
    
    $stmt = $conn->prepare("
        INSERT INTO coupons 
        (code, discount_percent, discount_amount, min_order_value, max_uses, valid_to)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param('sdddi' . (is_null($max_uses) ? 's' : 'i'), 
        $code, $discount_percent, $discount_amount, $min_order_value, $max_uses ?: null, $valid_to
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Coupon created']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create coupon']);
    }
    exit;
}

// ============================================================================
// REVENUE CHART
// ============================================================================

if ($action === 'revenue_chart') {
    $days = (int)($_GET['days'] ?? 7);
    
    $stmt = $conn->prepare("
        SELECT DATE(o.created_at) as date,
               SUM(o.quantity * p.price - o.discount_amount) as revenue,
               COUNT(o.id) as orders
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
    ");
    $stmt->bind_param('i', $days);
    $stmt->execute();
    $data = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_order') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $order_id = (int)$data['order_id'];
    $status = sanitizeInput($data['status'] ?? '');
    $tracking_number = sanitizeInput($data['tracking_number'] ?? '');
    $estimated_delivery = sanitizeInput($data['estimated_delivery'] ?? null);
    
    $stmt = $conn->prepare("
        UPDATE orders
        SET status = ?, tracking_number = ?, estimated_delivery = ?
        WHERE id = ?
    ");
    $stmt->bind_param('sssi', $status, $tracking_number, $estimated_delivery, $order_id);
    
    if ($stmt->execute()) {
        // Send notification to user
        $stmt = $conn->prepare("SELECT user_id FROM orders WHERE id = ?");
        $stmt->bind_param('i', $order_id);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();
        
        $msg = "Your order status has been updated to: $status";
        $stmt = $conn->prepare("
            INSERT INTO notifications (user_id, type, title, message, related_order_id)
            VALUES (?, 'order_status', 'Order Update', ?, ?)
        ");
        $stmt->bind_param('isi', $order['user_id'], $msg, $order_id);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Order updated']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update order']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
