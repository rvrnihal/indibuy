<?php
/**
 * index.php - Main entry point for IndiBuy
 * Routes requests to appropriate handlers
 */

// Detect request type
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$request_path = parse_url($request_uri, PHP_URL_PATH);

// Remove leading slash and base path
$request_path = ltrim($request_path, '/');

// Handle home/index
if (empty($request_path) || $request_path === 'index.php') {
    include __DIR__ . '/home.html';
    exit;
}

// Handle static files (CSS, JS, Images)
if (preg_match('/\.(css|js|jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|eot)$/', $request_path)) {
    // Serve static file (usually handled by web server)
    // Falls through to 404 if not found
}

// Handle API routes
if (strpos($request_path, 'api/') === 0) {
    $api_file = __DIR__ . '/' . $request_path . '.php';
    
    // Remove .php extension if doubled
    $api_file = str_replace('.php.php', '.php', $api_file);
    
    if (file_exists($api_file)) {
        include $api_file;
        exit;
    }
}

// Handle HTML files
if (file_exists(__DIR__ . '/' . $request_path)) {
    include __DIR__ . '/' . $request_path;
    exit;
}

if (file_exists(__DIR__ . '/' . $request_path . '.html')) {
    include __DIR__ . '/' . $request_path . '.html';
    exit;
}

// Handle setup/status endpoints
if ($request_path === 'setup' || $request_path === 'setup.php') {
    include __DIR__ . '/setup.php';
    exit;
}

if ($request_path === 'status' || $request_path === 'status.php') {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'running',
        'app' => 'IndiBuy Professional v2.0',
        'environment' => APP_ENV ?? 'unknown',
        'timestamp' => date('c')
    ]);
    exit;
}

// 404 Not Found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'statusCode' => 404,
    'message' => 'Page not found: ' . htmlspecialchars($request_path)
]);
exit;
