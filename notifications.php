<?php
/**
 * Notifications API
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
// GET NOTIFICATIONS
// ============================================================================

if ($action === 'list') {
    $unread_only = $_GET['unread'] ?? false;
    
    $query = "
        SELECT id, type, title, message, related_order_id, related_product_id,
               is_read, action_url, created_at
        FROM notifications
        WHERE user_id = ?
    ";
    
    if ($unread_only) {
        $query .= " AND is_read = 0";
    }
    
    $query .= " ORDER BY created_at DESC LIMIT 50";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $notifications = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $notifications]);
    exit;
}

// ============================================================================
// MARK AS READ
// ============================================================================

if ($action === 'mark_read') {
    $data = json_decode(file_get_contents('php://input'), true);
    $notification_id = (int)$data['id'] ?? 0;
    
    if (!$notification_id) {
        // Mark all as read
        $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->bind_param('i', $user_id);
    } else {
        $stmt = $conn->prepare("
            UPDATE notifications SET is_read = 1 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param('ii', $notification_id, $user_id);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Marked as read']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update']);
    }
    exit;
}

// ============================================================================
// GET UNREAD COUNT
// ============================================================================

if ($action === 'count') {
    $stmt = $conn->prepare("
        SELECT COUNT(*) as count FROM notifications 
        WHERE user_id = ? AND is_read = 0
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    echo json_encode(['success' => true, 'count' => $result['count']]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
