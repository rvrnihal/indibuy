<?php
/**
 * api/orders.php - Professional Order Management API
 * Features: Order creation, tracking, invoicing, bulk orders, analytics
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils/APIHelper.php';
require_once __DIR__ . '/../utils/ValidationRules.php';
require_once __DIR__ . '/../utils/SecurityManager.php';

APIHelper::init();

$action = $_GET['action'] ?? '';
$conn = getDBConnection();
$security = new SecurityManager($conn);

$ip = $_SERVER['REMOTE_ADDR'];
if (!$security->checkRateLimit($ip)) {
    APIHelper::error('Too many requests', 429);
}

switch ($action) {
    case 'create':
        createOrder($conn, $security);
        break;
    case 'list':
        listOrders($conn);
        break;
    case 'detail':
        getOrderDetail($conn);
        break;
    case 'track':
        trackOrder($conn);
        break;
    case 'invoice':
        generateInvoice($conn);
        break;
    case 'bulk-quote':
        generateBulkQuote($conn, $security);
        break;
    case 'analytics':
        getOrderAnalytics($conn);
        break;
    default:
        APIHelper::error('Invalid action', 400);
}

/**
 * Create Order
 */
function createOrder($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    
    APIHelper::validateRequired($data, ['user_id', 'items', 'shipping_address', 'payment_method']);
    
    // Validate order
    $errors = ValidationRules::validateOrder($data);
    if (!empty($errors)) {
        APIHelper::error('Validation failed', 400, $errors);
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        $orderNumber = generateOrderNumber();
        $totalAmount = 0;
        $orderItems = [];

        // Validate and calculate order total
        foreach ($data['items'] as $item) {
            $stmt = $conn->prepare("SELECT id, price, stock_quantity FROM products WHERE id = ?");
            $stmt->bind_param('i', $item['product_id']);
            $stmt->execute();
            $product = $stmt->get_result()->fetch_assoc();

            if (!$product) {
                throw new Exception('Product not found: ' . $item['product_id']);
            }

            if ($product['stock_quantity'] < $item['quantity']) {
                throw new Exception('Insufficient stock for product: ' . $item['product_id']);
            }

            $lineTotal = $product['price'] * $item['quantity'];
            $totalAmount += $lineTotal;
            $orderItems[] = [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $product['price'],
                'line_total' => $lineTotal
            ];
        }

        // Create order
        $stmt = $conn->prepare("INSERT INTO orders (order_number, user_id, total_amount, 
                               shipping_address, payment_method, status, created_at) 
                               VALUES (?, ?, ?, ?, ?, 'pending', NOW())");
        
        $stmt->bind_param('sidsss',
            $orderNumber,
            $data['user_id'],
            $totalAmount,
            $data['shipping_address'],
            $data['payment_method']
        );

        if (!$stmt->execute()) {
            throw new Exception('Failed to create order');
        }

        $orderId = $conn->insert_id;

        // Add order items
        $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) 
                                   VALUES (?, ?, ?, ?)");
        
        foreach ($orderItems as $item) {
            $itemStmt->bind_param('iidi',
                $orderId,
                $item['product_id'],
                $item['quantity'],
                $item['price']
            );
            if (!$itemStmt->execute()) {
                throw new Exception('Failed to add order item');
            }

            // Update stock
            $updateStmt = $conn->prepare("UPDATE products SET stock_quantity = stock_quantity - ? 
                                         WHERE id = ?");
            $updateStmt->bind_param('ii', $item['quantity'], $item['product_id']);
            $updateStmt->execute();
        }

        $conn->commit();

        $security->logSecurityEvent('ORDER_CREATED', ['order_id' => $orderId, 'amount' => $totalAmount], 'INFO');

        APIHelper::success([
            'order_id' => $orderId,
            'order_number' => $orderNumber,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'created_at' => date('c')
        ], 'Order created successfully', 201);

    } catch (Exception $e) {
        $conn->rollback();
        $security->logSecurityEvent('ORDER_FAILED', ['error' => $e->getMessage()], 'ERROR');
        APIHelper::error('Order creation failed: ' . $e->getMessage(), 400);
    }
}

/**
 * List Orders
 */
function listOrders($conn) {
    $userId = (int)($_GET['user_id'] ?? 0);
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 20);
    $offset = ($page - 1) * $limit;

    if (!$userId) {
        APIHelper::error('User ID required', 400);
    }

    $query = "SELECT id, order_number, total_amount, status, created_at FROM orders 
              WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('iii', $userId, $limit, $offset);
    $stmt->execute();

    $orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM orders WHERE user_id = ?");
    $countStmt->bind_param('i', $userId);
    $countStmt->execute();
    $total = $countStmt->get_result()->fetch_assoc()['total'];

    echo json_encode(APIHelper::paginated($orders, $total, $page, $limit));
}

/**
 * Get Order Detail
 */
function getOrderDetail($conn) {
    $orderId = (int)($_GET['id'] ?? 0);
    
    if (!$orderId) {
        APIHelper::error('Order ID required', 400);
    }

    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->bind_param('i', $orderId);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();

    if (!$order) {
        APIHelper::error('Order not found', 404);
    }

    // Get order items
    $itemsStmt = $conn->prepare("SELECT oi.*, p.name, p.image_url FROM order_items oi
                                LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?");
    $itemsStmt->bind_param('i', $orderId);
    $itemsStmt->execute();
    $order['items'] = $itemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    APIHelper::success($order, 'Order detail');
}

/**
 * Track Order
 */
function trackOrder($conn) {
    $orderId = (int)($_GET['id'] ?? 0);
    
    if (!$orderId) {
        APIHelper::error('Order ID required', 400);
    }

    $stmt = $conn->prepare("SELECT order_number, status, tracking_number, carrier FROM orders WHERE id = ?");
    $stmt->bind_param('i', $orderId);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();

    if (!$order) {
        APIHelper::error('Order not found', 404);
    }

    APIHelper::success($order, 'Tracking information');
}

/**
 * Generate Invoice
 */
function generateInvoice($conn) {
    $orderId = (int)($_GET['id'] ?? 0);
    
    if (!$orderId) {
        APIHelper::error('Order ID required', 400);
    }

    $stmt = $conn->prepare("SELECT o.*, u.name, u.email, u.phone FROM orders o
                           LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?");
    $stmt->bind_param('i', $orderId);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();

    if (!$order) {
        APIHelper::error('Order not found', 404);
    }

    // Get items
    $itemsStmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemsStmt->bind_param('i', $orderId);
    $itemsStmt->execute();
    $order['items'] = $itemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Generate PDF (requires TCPDF or similar)
    APIHelper::success($order, 'Invoice data prepared');
}

/**
 * Generate Bulk Quote
 */
function generateBulkQuote($conn, $security) {
    APIHelper::validateMethod('POST');
    
    $data = APIHelper::getRequestBody();
    APIHelper::validateRequired($data, ['items', 'email']);

    $quote = [
        'quote_number' => 'Q-' . date('YmdHis'),
        'valid_until' => date('c', strtotime('+30 days')),
        'items' => [],
        'total' => 0
    ];

    foreach ($data['items'] as $item) {
        $stmt = $conn->prepare("SELECT id, name, price FROM products WHERE id = ?");
        $stmt->bind_param('i', $item['product_id']);
        $stmt->execute();
        $product = $stmt->get_result()->fetch_assoc();

        if ($product) {
            $lineTotal = $product['price'] * $item['quantity'];
            $quote['items'][] = [
                'product_id' => $product['id'],
                'product_name' => $product['name'],
                'quantity' => $item['quantity'],
                'unit_price' => $product['price'],
                'line_total' => $lineTotal
            ];
            $quote['total'] += $lineTotal;
        }
    }

    $security->logSecurityEvent('BULK_QUOTE_GENERATED', ['email' => $data['email']], 'INFO');

    APIHelper::success($quote, 'Bulk quote generated', 201);
}

/**
 * Get Order Analytics
 */
function getOrderAnalytics($conn) {
    $userId = (int)($_GET['user_id'] ?? 0);
    
    if (!$userId) {
        APIHelper::error('User ID required', 400);
    }

    $stmt = $conn->prepare("SELECT 
                           COUNT(*) as total_orders,
                           SUM(total_amount) as total_spent,
                           AVG(total_amount) as average_order_value
                           FROM orders WHERE user_id = ?");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $analytics = $stmt->get_result()->fetch_assoc();

    APIHelper::success($analytics, 'Order analytics');
}

/**
 * Generate unique order number
 */
function generateOrderNumber() {
    return 'ORD-' . date('YmdHis') . '-' . strtoupper(bin2hex(random_bytes(3)));
}

$conn->close();
?>
