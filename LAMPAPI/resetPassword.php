<?php
    Access-Control-Allow-Origin: *


//view errors in browser (for debugging purposes)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//Include PHPMailer classes. DO NOT INDENT THEM
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// autoload PHPMailer
require '/var/www/html/vendor/autoload.php';

//decodes JSON input from HTTP request to PhP, allowing easy access to data sent by client 
$inData = getRequestInfo();

// Extract the data from the JSON input
$email = $inData["email"];

//create connection to SQL database
$conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");


//return error if cannot access database
if ($conn->connect_error) 
{
	returnWithError( $conn->connect_error );
} 

//database accessed -> 
else 
{
    //check if user exists by email
    $stmt = $conn->prepare("SELECT FirstName, LastName, Login, Password FROM Users WHERE Email=?");

    //bind param; set ? to email input from frontend
    $stmt->bind_param("s", $email); 
    $stmt->execute();
    $result = $stmt->get_result();

    //if user found
    if ($result->num_rows > 0)
    {
        //User found
        $row = $result->fetch_assoc();
        $firstName = $row["FirstName"];
        $lastName = $row["LastName"];
        $existingPassword = $row['Password']; 
        $login = $row["Login"];

        //generate new password
        $newPassword= generateRandomPassword($existingPassword); 

        //hash the new password (do/explain later**)
        $hashedPassword = $newPassword;

        //update the new password in the database
        $stmt = $conn->prepare("UPDATE Users SET Password=? WHERE Email=?");
        $stmt->bind_param("ss", $hashedPassword, $email); 
        $stmt->execute(); 

        //send the new password to user via PHPMailer
        sendResetEmail($firstName, $lastName, $email, $login, $newPassword);
        returnWithError(""); // Indicate success
    } 
    
    else 
    {
        returnWithError("User not found");
    }
}

// Function to generate a random password
function generateRandomPassword($existingPassword) {

    // Define a string containing all possible characters for the password
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    //str_shuffle: Randomly shuffles the characters in the string $characters

    //substr: Extracts a substring from the shuffled string, starting at position 0 and having a length of 8

    //random 8-character password.
    $newPassword = substr(str_shuffle($characters), 0, 8);

    return $newPassword;
}

// Function to get the request data sent in JSON format
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send the result back as JSON
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Function to return an error message in JSON format
function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}



//SENDING CONFRIMATION EMAIL USING PHPMAILER
function sendResetEmail($firstName, $lastName, $email, $login, $newPassword)
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
		$mail->Body    = "Hello $firstName, your Password has been reset.<br><br>"
                        . "Your credentials are:<br><br>"
                        . "Username: $login<br><br>"
                        . "Password: $newPassword"; //"." CONCATENATE PHP syntax, <br><br> newline for html 

		$mail->AltBody = "Hello $firstName, your password has been reset.\n\n"
						. "Your credentials are - \n\n"
						. "Username: $login\n\n"
						. "Password: $newPassword"; // Plain text for non-HTML mail clients (emails that dont read HTML)

		$mail->send();
	} 
	
	catch (Exception $e) {
		// Handle error if email fails to send
		returnWithError("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
	}
}

?>