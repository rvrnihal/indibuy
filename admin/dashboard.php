<?php
/**
 * admin/dashboard.php - Professional Admin Dashboard
 * Features: Real-time analytics, Order management, Inventory control, Performance metrics
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils/SecurityManager.php';

session_start();

// Check admin authentication
if (empty($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: ../login.html');
    exit;
}

$conn = getDBConnection();
$security = new SecurityManager($conn);

// Get dashboard metrics
$metrics = getDashboardMetrics($conn);
$topProducts = getTopProducts($conn);
$recentOrders = getRecentOrders($conn);
$orderStats = getOrderStats($conn);
$revenue = getRevenueMetrics($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - IndiBuy</title>
    <link rel="stylesheet" href="../static/css/modern.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.css">
    <style>
        .dashboard-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 0;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .metric-card {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 1.5rem;
            box-shadow: var(--shadow);
        }

        .metric-label {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .metric-change {
            font-size: 0.875rem;
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius);
            background-color: var(--success);
            color: white;
        }

        .metric-change.negative {
            background-color: var(--danger);
        }

        .chart-container {
            position: relative;
            width: 100%;
            height: 400px;
            margin-bottom: 2rem;
        }

        .table-responsive {
            overflow-x: auto;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--bg-primary);
            border-radius: var(--radius-md);
            overflow: hidden;
            box-shadow: var(--shadow);
        }

        .table th {
            background-color: var(--bg-secondary);
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid var(--border);
            color: var(--text-primary);
        }

        .table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .table tr:hover {
            background-color: var(--bg-secondary);
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius);
            font-size: 0.875rem;
            font-weight: 500;
        }

        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-completed {
            background-color: #dcfce7;
            color: #166534;
        }

        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .nav-tabs {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid var(--border);
            margin-bottom: 2rem;
        }

        .nav-tab {
            padding: 1rem 0;
            border-bottom: 3px solid transparent;
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition);
        }

        .nav-tab.active {
            border-bottom-color: var(--primary);
            color: var(--primary);
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background-color: var(--bg-secondary);
            border-right: 1px solid var(--border);
            padding: 1.5rem 0;
            overflow-y: auto;
            z-index: 99;
        }

        .sidebar-logo {
            padding: 0 1.5rem;
            margin-bottom: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .sidebar-menu {
            list-style: none;
        }

        .sidebar-menu-item {
            margin: 0.5rem 0;
        }

        .sidebar-menu-link {
            display: block;
            padding: 0.75rem 1.5rem;
            color: var(--text-primary);
            text-decoration: none;
            transition: var(--transition);
        }

        .sidebar-menu-link:hover {
            background-color: var(--bg-tertiary);
            color: var(--primary);
        }

        .sidebar-menu-link.active {
            background-color: var(--bg-tertiary);
            color: var(--primary);
            border-left: 3px solid var(--primary);
            padding-left: calc(1.5rem - 3px);
        }

        .main-content {
            margin-left: 250px;
            padding: 2rem;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: var(--transition);
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-logo">IndiBuy Admin</div>
        <ul class="sidebar-menu">
            <li class="sidebar-menu-item">
                <a href="#dashboard" class="sidebar-menu-link active">Dashboard</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#orders" class="sidebar-menu-link">Orders</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#products" class="sidebar-menu-link">Products</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#inventory" class="sidebar-menu-link">Inventory</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#users" class="sidebar-menu-link">Users</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#analytics" class="sidebar-menu-link">Analytics</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#reports" class="sidebar-menu-link">Reports</a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#settings" class="sidebar-menu-link">Settings</a>
            </li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <h1>Admin Dashboard</h1>

            <!-- Key Metrics -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">Total Revenue</div>
                    <div class="metric-value">₹<?php echo number_format($revenue['total'], 2); ?></div>
                    <span class="metric-change">+<?php echo $revenue['growth']; ?>% from last month</span>
                </div>

                <div class="metric-card">
                    <div class="metric-label">Total Orders</div>
                    <div class="metric-value"><?php echo $metrics['total_orders']; ?></div>
                    <span class="metric-change"><?php echo $metrics['pending_orders']; ?> pending</span>
                </div>

                <div class="metric-card">
                    <div class="metric-label">Active Users</div>
                    <div class="metric-value"><?php echo $metrics['active_users']; ?></div>
                    <span class="metric-change">+<?php echo $metrics['new_users_today']; ?> today</span>
                </div>

                <div class="metric-card">
                    <div class="metric-label">Product SKUs</div>
                    <div class="metric-value"><?php echo $metrics['total_products']; ?></div>
                    <span class="metric-change"><?php echo $metrics['low_stock_products']; ?> low stock</span>
                </div>
            </div>

            <!-- Charts -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 2rem; margin-top: 2rem;">
                <div class="card">
                    <div class="card-header">Revenue Trend (Last 30 Days)</div>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Order Status Distribution</div>
                    <div class="chart-container">
                        <canvas id="orderStatusChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Top Products -->
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header">Top Selling Products</div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Sales</th>
                                <th>Revenue</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($topProducts as $product): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($product['name']); ?></td>
                                <td><?php echo htmlspecialchars($product['category_name']); ?></td>
                                <td><?php echo $product['sales_count']; ?></td>
                                <td>₹<?php echo number_format($product['revenue'], 2); ?></td>
                                <td><?php echo $product['stock_quantity']; ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header">Recent Orders</div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recentOrders as $order): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($order['order_number']); ?></td>
                                <td><?php echo htmlspecialchars($order['user_name']); ?></td>
                                <td>₹<?php echo number_format($order['total_amount'], 2); ?></td>
                                <td>
                                    <span class="status-badge status-<?php echo strtolower($order['status']); ?>">
                                        <?php echo ucfirst($order['status']); ?>
                                    </span>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                                <td>
                                    <a href="order-detail.php?id=<?php echo $order['id']; ?>" class="btn btn-sm btn-primary">View</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script>
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: <?php echo json_encode($revenue['dates']); ?>,
                datasets: [{
                    label: 'Daily Revenue',
                    data: <?php echo json_encode($revenue['amounts']); ?>,
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Order Status Chart
        const statusCtx = document.getElementById('orderStatusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: <?php echo json_encode($orderStats['labels']); ?>,
                datasets: [{
                    data: <?php echo json_encode($orderStats['counts']); ?>,
                    backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    </script>
</body>
</html>

<?php
/**
 * Get dashboard metrics
 */
function getDashboardMetrics($conn) {
    $metrics = [];

    // Total orders
    $result = $conn->query("SELECT COUNT(*) as count FROM orders");
    $metrics['total_orders'] = $result->fetch_assoc()['count'];

    // Pending orders
    $result = $conn->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    $metrics['pending_orders'] = $result->fetch_assoc()['count'];

    // Active users
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE status = 'active'");
    $metrics['active_users'] = $result->fetch_assoc()['count'];

    // New users today
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()");
    $metrics['new_users_today'] = $result->fetch_assoc()['count'];

    // Total products
    $result = $conn->query("SELECT COUNT(*) as count FROM products");
    $metrics['total_products'] = $result->fetch_assoc()['count'];

    // Low stock products
    $result = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10");
    $metrics['low_stock_products'] = $result->fetch_assoc()['count'];

    return $metrics;
}

/**
 * Get top selling products
 */
function getTopProducts($conn) {
    $query = "SELECT p.id, p.name, c.name as category_name, p.stock_quantity,
                     COUNT(oi.id) as sales_count, SUM(oi.price * oi.quantity) as revenue
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id
              LEFT JOIN order_items oi ON p.id = oi.product_id
              GROUP BY p.id
              ORDER BY sales_count DESC
              LIMIT 10";

    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

/**
 * Get recent orders
 */
function getRecentOrders($conn) {
    $query = "SELECT o.id, o.order_number, u.name as user_name, o.total_amount, 
                     o.status, o.created_at
              FROM orders o
              LEFT JOIN users u ON o.user_id = u.id
              ORDER BY o.created_at DESC
              LIMIT 10";

    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

/**
 * Get order statistics
 */
function getOrderStats($conn) {
    $query = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
    $result = $conn->query($query);

    $labels = [];
    $counts = [];

    while ($row = $result->fetch_assoc()) {
        $labels[] = ucfirst($row['status']);
        $counts[] = $row['count'];
    }

    return [
        'labels' => $labels,
        'counts' => $counts
    ];
}

/**
 * Get revenue metrics
 */
function getRevenueMetrics($conn) {
    $query = "SELECT DATE(created_at) as date, SUM(total_amount) as amount
              FROM orders
              WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
              GROUP BY DATE(created_at)
              ORDER BY date ASC";

    $result = $conn->query($query);

    $dates = [];
    $amounts = [];

    while ($row = $result->fetch_assoc()) {
        $dates[] = date('M d', strtotime($row['date']));
        $amounts[] = $row['amount'];
    }

    // Calculate total and growth
    $totalQuery = "SELECT SUM(total_amount) as total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    $totalResult = $conn->query($totalQuery);
    $total = $totalResult->fetch_assoc()['total'] ?? 0;

    // Calculate growth percentage (simplified)
    $growth = 12; // placeholder

    return [
        'dates' => $dates,
        'amounts' => $amounts,
        'total' => $total,
        'growth' => $growth
    ];
}

$conn->close();
?>
