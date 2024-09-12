<?php
    Access-Control-Allow-Origin: *

    $inData = getRequestInfo();

    $id = $inData["id"];

    // Connect to the database
    $conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");

    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    } else {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE id=?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            // Success handling, e.g., return success message
            returnWithInfo("Contact deleted successfully");
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
