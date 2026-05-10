<?php
/**
 * DEPLOYMENT SETUP - Check & Configure
 * Run this first to verify your deployment
 */

echo "🚀 IndiBuy Deployment Checker\n";
echo "=" . str_repeat("=", 50) . "\n\n";

// 1. Check PHP version
echo "✓ PHP Version: " . PHP_VERSION . "\n";
if (version_compare(PHP_VERSION, '7.4', '<')) {
    echo "⚠ Warning: PHP 7.4+ recommended\n";
}

// 2. Check required extensions
$extensions = ['mysqli', 'pdo', 'pdo_mysql', 'json', 'bcrypt'];
echo "\n✓ Checking Extensions:\n";
foreach ($extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "  ✓ $ext\n";
    } else {
        echo "  ✗ $ext (MISSING)\n";
    }
}

// 3. Check directories
echo "\n✓ Checking Directories:\n";
$dirs = [
    'api' => 'API endpoints',
    'utils' => 'Utility classes',
    'static' => 'Frontend files',
    'admin' => 'Admin dashboard',
    'logs' => 'Error logs'
];

foreach ($dirs as $dir => $desc) {
    if (is_dir(__DIR__ . '/' . $dir)) {
        echo "  ✓ $dir/ ($desc)\n";
    } else {
        if ($dir === 'logs') {
            mkdir(__DIR__ . '/logs', 0755, true);
            echo "  ✓ $dir/ (CREATED)\n";
        } else {
            echo "  ✗ $dir/ (MISSING)\n";
        }
    }
}

// 4. Check .env file
echo "\n✓ Checking Configuration:\n";
if (file_exists(__DIR__ . '/.env')) {
    echo "  ✓ .env file found\n";
    $env = parse_ini_file(__DIR__ . '/.env');
    
    // Check required keys
    $required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
    foreach ($required as $key) {
        if (isset($env[$key])) {
            echo "    ✓ $key set\n";
        } else {
            echo "    ✗ $key missing\n";
        }
    }
} else {
    echo "  ✗ .env file NOT found\n";
    echo "    Create .env with:\n";
    echo "      DB_HOST=localhost\n";
    echo "      DB_USER=root\n";
    echo "      DB_PASS=\n";
    echo "      DB_NAME=paymentdb\n";
    echo "      APP_ENV=production\n";
}

// 5. Check file permissions
echo "\n✓ Checking Permissions:\n";
if (is_writable(__DIR__ . '/logs')) {
    echo "  ✓ logs/ is writable\n";
} else {
    echo "  ✗ logs/ not writable\n";
}

// 6. Database connection test
echo "\n✓ Testing Database Connection:\n";
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    $conn = new mysqli(
        $env['DB_HOST'] ?? 'localhost',
        $env['DB_USER'] ?? 'root',
        $env['DB_PASS'] ?? '',
        $env['DB_NAME'] ?? 'paymentdb'
    );
    
    if ($conn->connect_error) {
        echo "  ✗ Connection failed: " . $conn->connect_error . "\n";
    } else {
        echo "  ✓ Database connected successfully\n";
        
        // Check tables
        $result = $conn->query("SHOW TABLES");
        $count = $result->num_rows;
        echo "  ✓ Tables found: $count\n";
        $conn->close();
    }
}

// 7. API endpoints check
echo "\n✓ Checking API Files:\n";
$apis = ['auth.php', 'products.php', 'orders.php'];
foreach ($apis as $api) {
    if (file_exists(__DIR__ . '/api/' . $api)) {
        echo "  ✓ api/$api\n";
    } else {
        echo "  ✗ api/$api (MISSING)\n";
    }
}

// 8. Summary
echo "\n" . str_repeat("=", 50) . "\n";
echo "✅ Setup Check Complete!\n\n";
echo "Next steps:\n";
echo "1. Ensure .env is configured correctly\n";
echo "2. Run: php utils/DatabaseMigration.php migrate\n";
echo "3. Test API: GET /api/products.php?action=list\n";
echo "4. Deploy to Replit, Railway, or Docker\n";
echo "\n";
