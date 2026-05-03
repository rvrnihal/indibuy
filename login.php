

<?php
require_once 'config.php';

$response = ['success' => false, 'message' => ''];

// Handle Registration
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] === 'register') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        $response['message'] = 'Security token validation failed.';
        echo json_encode($response);
        exit;
    }

    // Sanitize and validate inputs
    $fullName = sanitizeInput($_POST['logname'] ?? '');
    $email = sanitizeInput($_POST['logemail'] ?? '');
    $password = $_POST['logpass'] ?? '';

    // Validation
    if (empty($fullName) || strlen($fullName) < 2) {
        $response['message'] = 'Full name must be at least 2 characters.';
    } elseif (!isValidEmail($email)) {
        $response['message'] = 'Invalid email format.';
    } elseif (!isStrongPassword($password)) {
        $response['message'] = 'Password must be at least 8 characters with uppercase, lowercase, and numbers.';
    } else {
        $conn = getDBConnection();
        
        // Check if email already exists
        $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $response['message'] = 'Email already registered.';
        } else {
            // Hash password and insert
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $fullName, $email, $hashedPassword);
            
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Registration successful! Please log in.';
            } else {
                $response['message'] = 'Registration failed. Please try again.';
            }
            $stmt->close();
        }
        $checkStmt->close();
        $conn->close();
    }
    echo json_encode($response);
    exit;
}

// Handle Login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] === 'login') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        $response['message'] = 'Security token validation failed.';
        echo json_encode($response);
        exit;
    }

    // Sanitize inputs
    $email = sanitizeInput($_POST['logemail'] ?? '');
    $password = $_POST['logpass'] ?? '';

    // Validation
    if (!isValidEmail($email) || empty($password)) {
        $response['message'] = 'Invalid email or password.';
    } else {
        $conn = getDBConnection();
        $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['full_name'];
                $response['success'] = true;
                $response['message'] = 'Login successful!';
                $response['redirect'] = 'home.html';
            } else {
                $response['message'] = 'Invalid email or password.';
            }
        } else {
            $response['message'] = 'Invalid email or password.';
        }
        $stmt->close();
        $conn->close();
    }
    echo json_encode($response);
    exit;
}
?>




<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LOGIN</title>
    <link rel="stylesheet" href="login.css">
     <link rel="stylesheet" href="style1.css">
     
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
    <!-- bootstrap links -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- bootstrap links -->
    <!-- fonts links -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather&display=swap" rel="stylesheet">
    <!-- fonts links -->
  </head>
  <body>
    <!-- navbar -->
    <nav class="navbar navbar-expand-lg" id="navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html" id="logo"><span id="span1">I</span>ndi<span>Buy</span></a> 
      </div>
    </nav>
  <!-- navbar -->
	<div class="section">
		<div class="container">
			<div class="row full-height justify-content-center">
				<div class="col-12 text-center align-self-center py-5">
					<div class="section pb-5 pt-5 pt-sm-2 text-center">
						<h6 class="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
			          	<input class="checkbox" type="checkbox" id="reg-log" name="reg-log"/>
			          	<label for="reg-log"></label>
						<div class="card-3d-wrap mx-auto">
							<div class="card-3d-wrapper">
								<div class="card-front">
									<div class="center-wrap">
										<div class="section text-center">
											<h4 class="mb-4 pb-3">Log In</h4>
											<form id="loginForm" method="POST" action="login.php">
                                                <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                                                <input type="hidden" name="action" value="login">
    <div class="form-group">
        <input type="email" name="logemail" class="form-style" placeholder="Your Email" id="logemail" autocomplete="off" required>
        <i class="input-icon uil uil-at"></i>
    </div>
    <div class="form-group mt-2">
        <input type="password" name="logpass" class="form-style" placeholder="Your Password" id="logpass" autocomplete="off" required>
        <i class="input-icon uil uil-lock-alt"></i>
    </div>
    <div id="loginMessage" class="alert alert-danger mt-2" style="display:none;"></div>
</form>
 
											<button type="submit" class="btn mt-4" onclick="handleLogin(event)">Submit</button>
                            				<p class="mb-0 mt-4 text-center"><a href="forget.html" class="link">Forgot your password?</a></p>
				      					</div>
			      					</div>
			      				</div>
								<div class="card-back">
									<div class="center-wrap">
										<div class="section text-center">
											<h4 class="mb-4 pb-3">Sign Up</h4>
											<form id="signupForm" method="POST" action="login.php">
                                                <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                                                <input type="hidden" name="action" value="register">
												<div class="form-group">
													<input type="text" name="logname" class="form-style" placeholder="Your Full Name" id="logname" autocomplete="off" required>
													<i class="input-icon uil uil-user"></i>
												</div>	
												<div class="form-group mt-2">
													<input type="email" name="logemail" class="form-style" placeholder="Your Email" id="logemail2" autocomplete="off" required>
													<i class="input-icon uil uil-at"></i>
												</div>	
												<div class="form-group mt-2">
													<input type="password" name="logpass" class="form-style" placeholder="Your Password (Min 8 chars, uppercase, lowercase, number)" id="logpass2" autocomplete="off" required>
													<i class="input-icon uil uil-lock-alt"></i>
												</div>
                                                <div id="signupMessage" class="alert alert-danger mt-2" style="display:none;"></div>
                                                <button type="submit" class="btn mt-4" onclick="handleSignup(event)">Submit</button>
											</form>
				      					</div>
			      					</div>
			      				</div>
			      			</div>
			      		</div>
			      	</div>
		      	</div>
	      	</div>
	    </div>
	</div>
    <!-- footer -->
    <footer id="footer">
      <div class="footer-top">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-6 footer-contact">
              <h3>Industrial Buy</h3>
              <p>
                Hyderabad <br>
                Telangana <br>
                India <br>
              </p>
              <strong>Phone:</strong> +91 7981505725<br>
              <strong>Email:</strong> industrialbuy@.com <br>
            </div>
            <div class="col-lg-3 col-md-6 footer-links">
              <h4>Usefull Links</h4>
             <ul>
              <li><a href="home.html">Home</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policey</a></li>
             </ul>
            </div>
            <div class="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
             <ul>
              <li><a href="#">mesh fence</a></li>
              <li><a href="#">iron rods</a></li>
              <li><a href="#">cement bricks</a></li>
              <li><a href="#">cement poles</a></li>
              <li><a href="#">iron sheds</a></li>
             </ul>
            </div>
            <div class="col-lg-3 col-md-6 footer-links">
              <h4>Our Social Networks</h4>
              <div class="socail-links mt-3">
                <a href="#"><i class="fa-brands fa-twitter"></i></a>
                <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i class="fa-brands fa-instagram"></i></a>
                <a href="#"><i class="fa-brands fa-skype"></i></a>
                <a href="#"><i class="fa-brands fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="container py-4">
        <div class="copyright">
          &copy; Copyright <strong><span>industrialbuy</span></strong>. All Rights Reserved
        </div>
        <div class="credits">
          Designed by <a href="#">SR Services</a>
        </div>
      </div>
    </footer>
    <!-- footer -->
    <a href="#" class="arrow"><i><img src="./images/arrow.png" alt=""></i></a>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script>
        async function handleLogin(event) {
            event.preventDefault();
            const form = document.getElementById('loginForm');
            const messageDiv = document.getElementById('loginMessage');
            
            try {
                const response = await fetch('login.php', {
                    method: 'POST',
                    body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    messageDiv.className = 'alert alert-success mt-2';
                    messageDiv.textContent = data.message;
                    messageDiv.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = data.redirect || 'home.html';
                    }, 1500);
                } else {
                    messageDiv.className = 'alert alert-danger mt-2';
                    messageDiv.textContent = data.message;
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                messageDiv.className = 'alert alert-danger mt-2';
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.display = 'block';
            }
        }

        async function handleSignup(event) {
            event.preventDefault();
            const form = document.getElementById('signupForm');
            const messageDiv = document.getElementById('signupMessage');
            
            try {
                const response = await fetch('login.php', {
                    method: 'POST',
                    body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    messageDiv.className = 'alert alert-success mt-2';
                    messageDiv.textContent = data.message;
                    messageDiv.style.display = 'block';
                    form.reset();
                    setTimeout(() => {
                        document.getElementById('reg-log').checked = false;
                    }, 2000);
                } else {
                    messageDiv.className = 'alert alert-danger mt-2';
                    messageDiv.textContent = data.message;
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                messageDiv.className = 'alert alert-danger mt-2';
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.display = 'block';
            }
        }
    </script>
  </body>
</html>