<?php
/**
 * api/products.php - Enhanced Products API
 * Features: Filtering, Sorting, Search, Pagination, Advanced Analytics
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils/APIHelper.php';
require_once __DIR__ . '/../utils/ValidationRules.php';
require_once __DIR__ . '/../utils/SecurityManager.php';

APIHelper::init();

$action = $_GET['action'] ?? '';
$conn = getDBConnection();
$security = new SecurityManager($conn);

// Rate limiting
$ip = $_SERVER['REMOTE_ADDR'];
if (!$security->checkRateLimit($ip)) {
    APIHelper::error('Too many requests', 429);
}

switch ($action) {
    case 'list':
        listProducts($conn);
        break;
    case 'search':
        searchProducts($conn);
        break;
    case 'detail':
        getProductDetail($conn);
        break;
    case 'compare':
        compareProducts($conn);
        break;
    case 'trending':
        getTrendingProducts($conn);
        break;
    case 'similar':
        getSimilarProducts($conn);
        break;
    default:
        APIHelper::error('Invalid action', 400);
}

/**
 * List products with advanced filtering
 */
function listProducts($conn) {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 20);
    $offset = ($page - 1) * $limit;
    
    $category = isset($_GET['category']) ? (int)$_GET['category'] : null;
    $search = $_GET['search'] ?? '';
    $sort = $_GET['sort'] ?? 'popularity';
    $min_price = (float)($_GET['min_price'] ?? 0);
    $max_price = (float)($_GET['max_price'] ?? 999999);
    $inStock = isset($_GET['in_stock']) ? (int)$_GET['in_stock'] : 1;

    // Build query
    $query = "SELECT id, name, description, price, image_url, rating, review_count, 
                     stock_quantity, category_id, seller_id, discount_percentage,
                     created_at FROM products WHERE price BETWEEN ? AND ?";
    
    $params = [$min_price, $max_price];
    $types = 'dd';

    if ($inStock) {
        $query .= " AND stock_quantity > 0";
    }

    if ($category) {
        $query .= " AND category_id = ?";
        $params[] = $category;
        $types .= 'i';
    }

    if (!empty($search)) {
        $search = '%' . $conn->real_escape_string($search) . '%';
        $query .= " AND (name LIKE ? OR description LIKE ?)";
        $params[] = $search;
        $params[] = $search;
        $types .= 'ss';
    }

    // Sorting
    switch ($sort) {
        case 'price_low':
            $query .= " ORDER BY price ASC";
            break;
        case 'price_high':
            $query .= " ORDER BY price DESC";
            break;
        case 'rating':
            $query .= " ORDER BY rating DESC, review_count DESC";
            break;
        case 'newest':
            $query .= " ORDER BY created_at DESC";
            break;
        case 'discount':
            $query .= " ORDER BY discount_percentage DESC";
            break;
        default:
            $query .= " ORDER BY (rating * review_count) DESC";
    }

    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM products WHERE price BETWEEN ? AND ?";
    if ($inStock) $countQuery .= " AND stock_quantity > 0";
    if ($category) $countQuery .= " AND category_id = ?";
    if (!empty($search)) $countQuery .= " AND (name LIKE ? OR description LIKE ?)";

    $countStmt = $conn->prepare($countQuery);
    $countStmt->bind_param($types, ...$params);
    $countStmt->execute();
    $total = $countStmt->get_result()->fetch_assoc()['total'];

    // Get paginated results
    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['final_price'] = round($row['price'] * (1 - $row['discount_percentage'] / 100), 2);
        $row['savings'] = round($row['price'] * $row['discount_percentage'] / 100, 2);
        $products[] = $row;
    }

    echo json_encode(APIHelper::paginated($products, $total, $page, $limit, 'Products retrieved successfully'));
}

/**
 * Search products with autocomplete
 */
function searchProducts($conn) {
    $query = $_GET['q'] ?? '';
    
    if (strlen($query) < 2) {
        APIHelper::error('Search query too short', 400);
    }

    $search = '%' . $conn->real_escape_string($query) . '%';
    $sql = "SELECT id, name, price, image_url, category_id FROM products 
            WHERE (name LIKE ? OR description LIKE ?) AND stock_quantity > 0 
            ORDER BY CASE WHEN name LIKE ? THEN 0 ELSE 1 END, name ASC LIMIT 20";
    
    $stmt = $conn->prepare($sql);
    $exactMatch = $query . '%';
    $stmt->bind_param('sss', $search, $search, $exactMatch);
    $stmt->execute();
    
    $results = [];
    while ($row = $stmt->get_result()->fetch_assoc()) {
        $results[] = $row;
    }

    APIHelper::success($results, 'Search results');
}

/**
 * Get product detail with reviews
 */
function getProductDetail($conn) {
    $productId = (int)($_GET['id'] ?? 0);
    
    if (!$productId) {
        APIHelper::error('Product ID required', 400);
    }

    $sql = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $productId);
    $stmt->execute();
    
    $product = $stmt->get_result()->fetch_assoc();
    if (!$product) {
        APIHelper::error('Product not found', 404);
    }

    // Get reviews
    $reviewsSql = "SELECT id, user_name, rating, comment, created_at FROM reviews 
                   WHERE product_id = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 50";
    $reviewsStmt = $conn->prepare($reviewsSql);
    $reviewsStmt->bind_param('i', $productId);
    $reviewsStmt->execute();
    $product['reviews'] = $reviewsStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Get specifications
    $specsSql = "SELECT specification_key, specification_value FROM product_specifications WHERE product_id = ?";
    $specsStmt = $conn->prepare($specsSql);
    $specsStmt->bind_param('i', $productId);
    $specsStmt->execute();
    $specs = [];
    while ($row = $specsStmt->get_result()->fetch_assoc()) {
        $specs[$row['specification_key']] = $row['specification_value'];
    }
    $product['specifications'] = $specs;

    APIHelper::success($product, 'Product detail retrieved');
}

/**
 * Compare multiple products
 */
function compareProducts($conn) {
    $ids = $_GET['ids'] ?? '';
    $ids = array_map('intval', array_filter(explode(',', $ids)));
    
    if (empty($ids) || count($ids) > 5) {
        APIHelper::error('Provide 1-5 product IDs', 400);
    }

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "SELECT id, name, price, rating, specification FROM products WHERE id IN ($placeholders)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(str_repeat('i', count($ids)), ...$ids);
    $stmt->execute();
    
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    APIHelper::success($products, 'Comparison data');
}

/**
 * Get trending products
 */
function getTrendingProducts($conn) {
    $days = (int)($_GET['days'] ?? 7);
    
    $sql = "SELECT p.id, p.name, p.price, p.rating, p.image_url, 
                   COUNT(o.id) as sales_count
            FROM products p
            LEFT JOIN order_items o ON p.id = o.product_id
            LEFT JOIN orders od ON o.order_id = od.id
            WHERE od.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY p.id
            ORDER BY sales_count DESC
            LIMIT 20";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $days);
    $stmt->execute();
    
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    APIHelper::success($products, 'Trending products');
}

/**
 * Get similar products
 */
function getSimilarProducts($conn) {
    $productId = (int)($_GET['id'] ?? 0);
    
    if (!$productId) {
        APIHelper::error('Product ID required', 400);
    }

    $sql = "SELECT p.id, p.name, p.price, p.rating, p.image_url
            FROM products p
            JOIN products p2 ON p.category_id = p2.category_id
            WHERE p2.id = ? AND p.id != ? AND p.stock_quantity > 0
            LIMIT 10";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $productId, $productId);
    $stmt->execute();
    
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    APIHelper::success($products, 'Similar products');
}

$conn->close();
?>
