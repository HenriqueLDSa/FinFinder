<?php
    $inData = getRequestInfo();

    $userID = $inData["userID"];

    // Connect to the database
    $conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");
    
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    } else {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? LIMIT 1");
        $stmt->bind_param("i", $userID);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            // Fetch only the first result as an associative array
            if ($contact = $result->fetch_assoc()) {
                returnWithInfo($contact);
            } else {
                returnWithError("No contacts found.");
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
