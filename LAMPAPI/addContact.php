<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $userID = $inData["userID"];

    // Connect to the database
    $conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");
    
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    } else {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
        
        if ($stmt->execute()) {
            // Success handling, e.g., return success message
            returnWithInfo("Contact added successfully");
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

    function returnWithInfo($info)
    {
        $retValue = '{"info":"' . $info . '"}';
        sendResultInfoAsJson($retValue);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
?>
