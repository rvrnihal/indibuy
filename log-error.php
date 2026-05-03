<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data && isset($data['message'])) {
        $message = sanitizeInput($data['message'] ?? '');
        $stack = sanitizeInput($data['stack'] ?? '');
        $url = sanitizeInput($data['url'] ?? '');
        $userId = $_SESSION['user_id'] ?? null;
        
        $conn = getDBConnection();
        
        $stmt = $conn->prepare("INSERT INTO error_logs (error_message, error_trace, user_id) VALUES (?, ?, ?)");
        $errorInfo = "$message | URL: $url";
        $stmt->bind_param("ssi", $errorInfo, $stack, $userId);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to log error']);
        }
        
        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
