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

        if($stmt->execute())
        {
            try 
            {
                sendConfirmationEmail($firstName, $lastName, $email, $login, $password);
            } 
            catch (Exception $e) 
            {
                returnWithError("Email could not be sent. Mailer Error: {$e->getMessage()}");
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
		$mail->setFrom('team27poosd@outlook.com', 'Contact Search Application');
		$mail->addAddress($email, "$firstName $lastName");

		// Content
		$mail->isHTML(true); // Set email format to HTML
		$mail->Subject = "Team 27 Contact Search Application Account Registration";
		$mail->Body    = "Hello $firstName, your registration was successful.<br><br>"
                        . "Your credentials are:<br><br>"
                        . "Username: $login<br><br>"
                        . "Password: $password"; //"." CONCATENATE PHP syntax, <br><br> newline for html 

		$mail->AltBody = "Hello $firstName, your registration was successful.\n\n"
						. "Your credentials are - \n\n"
						. "Username: $login\n\n"
						. "Password: $password"; // Plain text for non-HTML mail clients (emails that dont read HTML)

		$mail->send();
	} 
	
	catch (Exception $e) {
		// Handle error if email fails to send
		returnWithError("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
	}
}
	
?>