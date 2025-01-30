<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "paymentDB";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $zip = $_POST['zip'];
    $cardName = $_POST['cardName'];
    $cardNumber = $_POST['cardNumber'];
    $expMonth = $_POST['expMonth'];
    $expYear = $_POST['expYear'];
    $cvv = $_POST['cvv'];

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO payments (full_name, email, address, city, state, zip, card_name, card_number, exp_month, exp_year, cvv)
            VALUES ('$name', '$email', '$address', '$city', '$state', '$zip', '$cardName', '$cardNumber', '$expMonth', '$expYear', '$cvv')";

    if ($conn->query($sql) === TRUE) {
        echo "Payment information submitted successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
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
