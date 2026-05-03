<?php
/**
 * Products API - Enhanced with variants, reviews, and advanced features
 */

require_once 'config.php';

$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

// ============================================================================
// GET PRODUCTS WITH FILTERS
// ============================================================================

if ($action === 'list') {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 20);
    $offset = ($page - 1) * $limit;
    
    $category = $_GET['category'] ?? null;
    $search = $_GET['search'] ?? null;
    $sort = $_GET['sort'] ?? 'popularity'; // popularity, price_asc, price_desc, rating, newest
    $min_price = (float)($_GET['min_price'] ?? 0);
    $max_price = (float)($_GET['max_price'] ?? 999999);
    
    $query = "SELECT p.*, c.name as category_name, s.name as seller_name 
              FROM products p 
              LEFT JOIN categories c ON p.category_id = c.id 
              LEFT JOIN sellers s ON p.seller_id = s.id 
              WHERE p.stock_quantity > 0 
              AND p.price BETWEEN ? AND ?";
    
    $params = [$min_price, $max_price];
    
    if ($category) {
        $query .= " AND p.category_id = ?";
        $params[] = (int)$category;
    }
    
    if ($search) {
        $search = '%' . $search . '%';
        $query .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $params[] = $search;
        $params[] = $search;
    }
    
    // Sort options
    switch ($sort) {
        case 'price_asc':
            $query .= " ORDER BY p.price ASC";
            break;
        case 'price_desc':
            $query .= " ORDER BY p.price DESC";
            break;
        case 'rating':
            $query .= " ORDER BY p.rating DESC";
            break;
        case 'newest':
            $query .= " ORDER BY p.created_at DESC";
            break;
        default:
            $query .= " ORDER BY p.rating DESC, p.review_count DESC";
    }
    
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param(str_repeat('d', count($params) - 2) . 'ii', ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'page' => $page,
        'limit' => $limit
    ]);
    exit;
}

// ============================================================================
// GET PRODUCT DETAILS WITH VARIANTS AND REVIEWS
// ============================================================================

if ($action === 'get') {
    $product_id = (int)$_GET['id'];
    
    // Get product
    $stmt = $conn->prepare("
        SELECT p.*, c.name as category_name, s.name as seller_name, s.rating as seller_rating
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN sellers s ON p.seller_id = s.id
        WHERE p.id = ?
    ");
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    $product = $stmt->get_result()->fetch_assoc();
    
    if (!$product) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        exit;
    }
    
    // Get variants
    $stmt = $conn->prepare("
        SELECT id, variant_type, variant_value, additional_price, stock_quantity
        FROM product_variants
        WHERE product_id = ?
        GROUP BY variant_type, variant_value
    ");
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    $variants = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get reviews
    $stmt = $conn->prepare("
        SELECT pr.*, u.name as user_name
        FROM product_reviews pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC
        LIMIT 10
    ");
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    $reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'success' => true,
        'product' => $product,
        'variants' => $variants,
        'reviews' => $reviews
    ]);
    exit;
}

// ============================================================================
// ADD/UPDATE REVIEW
// ============================================================================

if ($action === 'add_review') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $product_id = (int)$data['product_id'];
    $rating = (int)$data['rating'];
    $title = sanitizeInput($data['title'] ?? '');
    $comment = sanitizeInput($data['comment'] ?? '');
    $user_id = $_SESSION['user_id'];
    
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid rating']);
        exit;
    }
    
    // Verify purchase
    $stmt = $conn->prepare("SELECT id FROM orders WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param('ii', $user_id, $product_id);
    $stmt->execute();
    $purchase = $stmt->get_result()->fetch_assoc();
    
    // Insert/update review
    $stmt = $conn->prepare("
        INSERT INTO product_reviews (product_id, user_id, rating, title, comment, verified_purchase)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = ?, title = ?, comment = ?
    ");
    $verified = !empty($purchase) ? 1 : 0;
    $stmt->bind_param('iiissiissi', $product_id, $user_id, $rating, $title, $comment, $verified, $rating, $title, $comment);
    
    if ($stmt->execute()) {
        // Update product rating
        $stmt = $conn->prepare("
            UPDATE products 
            SET rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = ?),
                review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = ?)
            WHERE id = ?
        ");
        $stmt->bind_param('iii', $product_id, $product_id, $product_id);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Review added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add review']);
    }
    exit;
}

// ============================================================================
// WISHLIST OPERATIONS
// ============================================================================

if ($action === 'wishlist_add') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $product_id = (int)$data['product_id'];
    $variant_id = (int)($data['variant_id'] ?? 0);
    $user_id = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("
        INSERT INTO wishlist (user_id, product_id, variant_id)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param('iii', $user_id, $product_id, $variant_id ?: null);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Added to wishlist']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add to wishlist']);
    }
    exit;
}

if ($action === 'wishlist_get') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("
        SELECT w.id, p.*, c.name as category_name
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $items]);
    exit;
}

// ============================================================================
// GET CATEGORIES
// ============================================================================

if ($action === 'categories') {
    $stmt = $conn->prepare("
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.name
    ");
    $stmt->execute();
    $categories = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $categories]);
    exit;
}

// ============================================================================
// SEARCH PRODUCTS
// ============================================================================

if ($action === 'search') {
    $query = sanitizeInput($_GET['q'] ?? '');
    
    if (strlen($query) < 2) {
        echo json_encode(['success' => false, 'message' => 'Query too short']);
        exit;
    }
    
    $search = '%' . $query . '%';
    
    $stmt = $conn->prepare("
        SELECT id, name, price, rating, image_url
        FROM products
        WHERE name LIKE ? OR description LIKE ?
        LIMIT 10
    ");
    $stmt->bind_param('ss', $search, $search);
    $stmt->execute();
    $results = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $results]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
