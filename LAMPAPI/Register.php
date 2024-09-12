<?php
    header("Access-Control-Allow-Origin: *");

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
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$login = $inData["login"];
$password = $inData["password"];

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
	//check if user already exists in database
	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Email=?");
	$stmt->bind_param("s", $email);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0)
	{
		//return error: User already exists
		returnWithError("Credentials already exist for the email address you entered.");
	}

	else //user does not already exist -> 
	{
		// Prepare the SQL statement for inserting a new user
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Login, Password) VALUES (?, ?, ?, ?, ?)"); //? for each entry!!!
		
		// Bind the parameters to the SQL statement
		// 'ssss' indicates that all four parameters are strings
		$stmt->bind_param("sssss", $firstName, $lastName, $email, $login, $password); //s for each entry!!

		// Execute the SQL statement, if executed
		if($stmt->execute())
		{
			try 
			{
                sendConfirmationEmail($firstName, $lastName, $email, $login, $password);
                returnWithError("");  // Success with no error
            } 
			
			catch (Exception $e) 
			{
                returnWithError("Email could not be sent. Mailer Error: {$e->getMessage()}");
            } 
		}
		
		else
		{
			// If there is an error during execution, return with the error message
			returnWithError($stmt->error);
		}
		
		// Close the statement and the database connection
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