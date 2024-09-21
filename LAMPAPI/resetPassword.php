<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
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

        //hash the new password SET Characters in Users to 255: ALTER TABLE Users MODIFY Password VARCHAR(255);
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        //update the new password in the database
        $stmt = $conn->prepare("UPDATE Users SET Password=? WHERE Email=?");
        $stmt->bind_param("ss", $hashedPassword, $email); 
        $stmt->execute(); 

        //send the new password to user via PHPMailer
        sendResetEmail($firstName, $lastName, $email, $login, $newPassword);
        returnWithMessage("Email with password sent successfully"); // Indicate success
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

function returnWithMessage( $msg ) 
{
	$retValue = '{"message":"' . $msg . '"}';
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
        $mail->setFrom('team27poosd@outlook.com', 'WaveLink');
        $mail->addAddress($email, "$firstName $lastName");

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = "Team 27 Contact Search Application Account Registration";

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
                <p>Your password has been successfully reset.</p>
                <p>Here are your account details:</p>
                <ul>
                    <li><strong>Username:</strong> $login</li>
                    <li><strong>Password:</strong> $newPassword</li>
                </ul>
                <p>To log in, please <a href='http://team27poosd.site/login'>click here</a>.</p>
                <p>If you did not request a password reset, please contact us immediately at <a href='mailto:team27poosd@outlook.com'>team27poosd@outlook.com</a>.</p>

                <p>Thank you, <br> The Contact Search Application Team</p>
                
                <div class='footer'>
                    <p>If you have any questions, feel free to contact our support team at <a href='mailto:team27poosd@outlook.com'>team27poosd@outlook.com</a>.</p>
                </div>
            </body>
            </html>
        ";

        $mail->AltBody = "
        Hello $firstName,

        Your password has been successfully reset.

        Here are your account details:
        Username: $login
        Password: $newPassword

        To log in, please visit: http://team27poosd.site/login

        If you did not request a password reset, please contact us immediately at team27poosd@outlook.com.

        Thank you,
        The Contact Search Application Team

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