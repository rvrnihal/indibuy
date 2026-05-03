<?php
require_once 'config.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        $response['message'] = 'Security token validation failed.';
        echo json_encode($response);
        exit;
    }

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        $response['message'] = 'Please log in before making a payment.';
        echo json_encode($response);
        exit;
    }

    // Sanitize and validate inputs
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $address = sanitizeInput($_POST['address'] ?? '');
    $city = sanitizeInput($_POST['city'] ?? '');
    $state = sanitizeInput($_POST['state'] ?? '');
    $zip = sanitizeInput($_POST['zip'] ?? '');

    // SECURITY: Do NOT accept credit card data directly!
    // In production, use Stripe, PayPal, or Razorpay tokenization
    // This prevents PCI DSS compliance issues
    $paymentToken = sanitizeInput($_POST['paymentToken'] ?? '');

    // Validation
    if (empty($name) || empty($email) || empty($address) || empty($city)) {
        $response['message'] = 'Please fill all required fields.';
    } elseif (!isValidEmail($email)) {
        $response['message'] = 'Invalid email format.';
    } elseif (!preg_match('/^\d{5,6}$/', $zip)) {
        $response['message'] = 'Invalid ZIP code format.';
    } elseif (empty($paymentToken)) {
        $response['message'] = 'Payment token is required. Use a payment gateway.';
    } else {
        $conn = getDBConnection();
        
        // Store order information (NOT credit card details)
        $stmt = $conn->prepare("INSERT INTO orders (user_id, full_name, email, address, city, state, zip, payment_token, status, created_at) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");
        $status = 'pending';
        $stmt->bind_param("isssssss", $_SESSION['user_id'], $name, $email, $address, $city, $state, $zip, $paymentToken);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Order placed successfully! Your payment is being processed.';
            $response['orderId'] = $conn->insert_id;
        } else {
            error_log("Order insertion failed: " . $conn->error);
            $response['message'] = 'Failed to process order. Please try again.';
        }
        
        $stmt->close();
        $conn->close();
    }
    
    echo json_encode($response);
    exit;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Page</title>
    <link rel="stylesheet" href="payment.css">
    <link rel="stylesheet" href="style1.css">
</head>
<body>
    <div class="container">
        <h2>Payment Information</h2>
        <form id="paymentForm" method="POST" action="">
            <div class="section">
                <h3>Personal Information</h3>
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>

                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="section">
                <h3>Address</h3>
                <label for="address">Address</label>
                <input type="text" id="address" name="address" required>

                <label for="city">City</label>
                <input type="text" id="city" name="city" required>

                <label for="state">State</label>
                <input type="text" id="state" name="state" required>

                <label for="zip">ZIP Code</label>
                <input type="text" id="zip" name="zip" required>
            </div>

            <div class="section">
                <h3>Payment Details</h3>
                <label for="cardName">Name on Card</label>
                <input type="text" id="cardName" name="cardName" required>

                <label for="cardNumber">Credit Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" required>

                <label for="expMonth">Exp Month</label>
                <input type="text" id="expMonth" name="expMonth" required>

                <label for="expYear">Exp Year</label>
                <input type="text" id="expYear" name="expYear" required>

                <label for="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" required>
            </div>

            <button type="submit">Submit Payment</button>
        </form>
    </div>
</body>
</html>
