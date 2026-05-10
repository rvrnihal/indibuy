<?php
/**
 * ValidationRules.php - Advanced Input Validation Rules
 */

class ValidationRules {
    
    /**
     * Validate product data
     */
    public static function validateProduct($data) {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 3) {
            $errors['name'] = 'Product name must be at least 3 characters';
        }

        if (empty($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
            $errors['price'] = 'Valid price is required';
        }

        if (empty($data['category_id']) || !is_numeric($data['category_id'])) {
            $errors['category_id'] = 'Valid category is required';
        }

        if (empty($data['stock_quantity']) || !is_numeric($data['stock_quantity']) || $data['stock_quantity'] < 0) {
            $errors['stock_quantity'] = 'Valid stock quantity is required';
        }

        return $errors;
    }

    /**
     * Validate user registration
     */
    public static function validateRegistration($data) {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 3) {
            $errors['name'] = 'Name must be at least 3 characters';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Valid email is required';
        }

        if (empty($data['password']) || strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        }

        if (empty($data['phone']) || !preg_match('/^[0-9]{10}$/', $data['phone'])) {
            $errors['phone'] = 'Valid 10-digit phone number is required';
        }

        return $errors;
    }

    /**
     * Validate order data
     */
    public static function validateOrder($data) {
        $errors = [];

        if (empty($data['user_id']) || !is_numeric($data['user_id'])) {
            $errors['user_id'] = 'Valid user is required';
        }

        if (empty($data['items']) || !is_array($data['items'])) {
            $errors['items'] = 'Order items are required';
        }

        if (empty($data['shipping_address'])) {
            $errors['shipping_address'] = 'Shipping address is required';
        }

        if (empty($data['payment_method'])) {
            $errors['payment_method'] = 'Payment method is required';
        }

        return $errors;
    }

    /**
     * Validate payment data
     */
    public static function validatePayment($data) {
        $errors = [];

        if (empty($data['amount']) || !is_numeric($data['amount']) || $data['amount'] <= 0) {
            $errors['amount'] = 'Valid amount is required';
        }

        if (empty($data['payment_method'])) {
            $errors['payment_method'] = 'Payment method is required';
        }

        if ($data['payment_method'] === 'card') {
            if (empty($data['card_number']) || !self::validateCardNumber($data['card_number'])) {
                $errors['card_number'] = 'Valid card number is required';
            }
        }

        return $errors;
    }

    /**
     * Validate card number using Luhn algorithm
     */
    public static function validateCardNumber($cardNumber) {
        $cardNumber = preg_replace('/\D/', '', $cardNumber);
        if (strlen($cardNumber) < 13 || strlen($cardNumber) > 19) {
            return false;
        }

        $sum = 0;
        $digit = 0;
        $addend = 0;
        $timesTwo = false;

        for ($i = strlen($cardNumber) - 1; $i >= 0; $i--) {
            $digit = (int)substr($cardNumber, $i, 1);
            if ($timesTwo) {
                $addend = $digit * 2;
                if ($addend > 9) {
                    $addend -= 9;
                }
            } else {
                $addend = $digit;
            }
            $sum += $addend;
            $timesTwo = !$timesTwo;
        }

        $modulus = $sum % 10;
        return $modulus == 0;
    }

    /**
     * Sanitize string
     */
    public static function sanitizeString($str) {
        $str = strip_tags($str);
        $str = htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
        $str = trim($str);
        return $str;
    }

    /**
     * Validate URL
     */
    public static function validateURL($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Validate IP
     */
    public static function validateIP($ip) {
        return filter_var($ip, FILTER_VALIDATE_IP) !== false;
    }
}
?>
