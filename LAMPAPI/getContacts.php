<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    $inData = getRequestInfo();

    $userID = $inData["userID"];

    // Connect to the database
    $conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");
    
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    } else {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=?");
        $stmt->bind_param("i", $userID);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $contacts = array(); // Initialize an array to store all contacts

            // Fetch all results as an associative array and store in $contacts array
            while ($contact = $result->fetch_assoc()) {
                $contacts[] = $contact;
            }

            // Check if there are any contacts found
            if (count($contacts) > 0) {
                returnWithInfo($contacts); // Return the entire array of contacts
            } else {
                returnWithError("No contacts found");
            }
        } else {
            // Error handling
            returnWithError($stmt->error);
        }

        // Close statement and connection
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($data)
    {
        $retValue = json_encode($data);
        sendResultInfoAsJson($retValue);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
?>
