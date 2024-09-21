<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '/var/www/html/vendor/autoload.php';


$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$login = $inData["login"];
$password = $inData["password"];

$conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");

if ($conn->connect_error) 
{
	returnWithError( $conn->connect_error );
} 
else 
{
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Email=? OR Login=?");
    $stmt->bind_param("ss", $email, $login);  // Bind both email and login
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0)
    {
        $row = $result->fetch_assoc();
        if ($row["Email"] === $email) {
            returnWithError("Credentials already exist for the email address you entered");
        } else if ($row["Login"] === $login) {
            returnWithError("Username already taken. Please choose a different one.");
        }
    }
    else 
    {
        returnWithMessage("Registration Successful"); 

		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Login, Password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $login, $hashedPassword);

        if ($stmt->execute()) {
            returnWithMessage("Registration Successful");
            
            try {
                sendConfirmationEmail($firstName, $lastName, $email, $login, $password);
            } catch (Exception $e) {
                returnWithError("Registration successful, but email could not be sent: " . $e->getMessage());
            }
        }
        else
        {
            returnWithError($stmt->error);
        }
        
        $stmt->close();
        $conn->close();
    }
}

//FOR TESTING ON POSTMAN

// Function to get the request data sent in JSON format
function getRequestInfo()
{
	// Decode the JSON data and return it as an associative array
	return json_decode(file_get_contents('php://input'), true);
}

// Function to send the result back as JSON
function sendResultInfoAsJson( $obj )
{
	// Set the content type to JSON
	header('Content-type: application/json');

	// Output the JSON encoded object
	echo $obj;
}

// Function to return an error message in JSON format
function returnWithError( $err )
{
	// Create a JSON object with the error message
	$retValue = '{"error":"' . $err . '"}';
	
	// Send the error message back as JSON
	sendResultInfoAsJson( $retValue );
}

function returnWithMessage( $msg ) 
{
	$retValue = '{"message":"' . $msg . '"}';
	sendResultInfoAsJson($retValue);
}

//SENDING CONFRIMATION EMAIL USING PHPMAILER
function sendConfirmationEmail($firstName, $lastName, $email, $login, $password)
{
	$mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.office365.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;
        $mail->Username   = 'team27poosd@outlook.com';  // SMTP username
        $mail->Password   = 'PoosdTeam27!';  // SMTP password
        $mail->SMTPSecure = 'tls';            // Enable TLS encryption, `ssl` also accepted
        $mail->Port       = 587;              // TCP port to connect to

        //Recipients
        $mail->setFrom('team27poosd@outlook.com', 'WaveLink');
        $mail->addAddress($email, "$firstName $lastName");

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = "Welcome to WaveLink!";

        $mail->Body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    h2 { color: #0a3d91; }
                    p { font-size: 14px; }
                    .footer { font-size: 12px; color: #888; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h2>Hello $firstName,</h2>
                <p>Thank you for joining WaveLink! Your account has been successfully created.</p>
                <p>Here are your account details:</p>
                <ul>
                    <li><strong>Username:</strong> $login</li>
                </ul>
                <p>To get started, please <a href='http://team27poosd.site/login'>log in to your account</a>.</p>
                <p>If you did not create this account, please contact us immediately at <a href='mailto:team27poosd@outlook.com'>team27poosd@outlook.com</a>.</p>

                <p>Thank you, <br> The WaveLink Team</p>
                
                <div class='footer'>
                    <p>If you have any questions, feel free to contact our support team at <a href='mailto:team27poosd@outlook.com'>team27poosd@outlook.com</a>.</p>
                </div>
            </body>
            </html>
        ";

        $mail->AltBody = "
        Hello $firstName,

        Thank you for joining WaveLink! Your account has been successfully created.

        Here are your account details:
        Username: $login

        To get started, please log in to your account: http://team27poosd.site/login

        If you did not create this account, please contact us immediately at team27poosd@outlook.com.

        Thank you,
        The WaveLink Team

        If you have any questions, feel free to contact our support team at team27poosd@outlook.com.
        ";

        $mail->send();
    } 

    catch (Exception $e) {
        // Handle error if email fails to send
        returnWithError("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }

}
	
?>