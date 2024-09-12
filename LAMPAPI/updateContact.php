<?php
    header("Access-Control-Allow-Origin: *");

    $inData = getRequestInfo();

    $id = $inData["id"];    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];

    // Connect to the database
    $conn = new mysqli("localhost", "Main27", "Team27Poosd", "COP4331");
    
    if( $conn->connect_error )
    {
        returnWithError($conn->connect_error);
    } else {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);
        
        if ($stmt->execute()) {
            // Check if any rows were actually updated
            if ($stmt->affected_rows > 0) {
                returnWithInfo("Contact updated successfully");
            } else {
                returnWithError("No contact found with the provided ID.");
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
