
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: admin.php
    Description: This file handles booking search requests and taxi assignment
    requests for the CabsOnline admin page. It returns JSON responses.
*/


<?php
header("Content-Type: application/json");

$host = "webdev.aut.ac.nz";
$dbname = "bvf2703";
$username = "bvf2703";
$password = "tuumyvkdsxafwxfcgajytsmtgppzqngwp";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database connection failed."
    ]);
    exit;
}

$action = $_GET["action"] ?? "";

if ($action === "search") {
    handleSearch($pdo);
} elseif ($action === "assign") {
    handleAssign($pdo);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Invalid request."
    ]);
    exit;
}

function handleSearch($pdo)
{
    $bsearch = trim($_GET["bsearch"] ?? ""); 

    try {
        if ($bsearch !== "") {
            if (!preg_match("/^BRN\d{5}$/", $bsearch)) {
                echo json_encode([
                    "success" => false,
                    "error" => "Invalid booking reference number format."
                ]);
                exit;
            }

            $sql = "SELECT 
                        ref_no AS booking_ref, 
                        cname AS customer_name, 
                        phone, 
                        sbname AS pickup_suburb, 
                        dsbname AS destination_suburb,
                        date, 
                        time, 
                        status,
                        booking_datetime
                     FROM bookings
                     WHERE ref_no = :ref_no";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":ref_no" => $bsearch
            ]);
            
            $bookings = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$bookings) {
                echo json_encode([
                    "success" => false,
                    "error" => "Booking reference number not found."
                ]);
                exit;
            }

            $pickupDateTime = date("d/m/Y H:i", strtotime($bookings["date"] . " " . $bookings["time"]));
            
            $result = [
                "success" => true,
                "bookings" => [
                    [
                        "booking_ref" => $bookings["booking_ref"],
                        "customer_name" => $bookings["customer_name"],
                        "phone" => $bookings["phone"],
                        "pickup_suburb" => $bookings["pickup_suburb"],
                        "destination_suburb" => $bookings["destination_suburb"],
                        "pickup_datetime" => $pickupDateTime,
                        "status" => $bookings["status"]
                    ]
                ]
            ];
            
            echo json_encode($result);
            exit;
        } else {
            // Handle empty search (within 2 hours)
            $currentDateTime = new DateTime();
            $currentDateString = $currentDateTime->format('Y-m-d');
            $currentTime = $currentDateTime->format('H:i');
            $twoHoursTime = $currentDateTime->modify('+2 hours')->format('H:i');
            $nextDate = $currentDateTime->modify('+1 day')->format('Y-m-d');

            $sql = "SELECT 
            ref_no AS booking_ref, 
            cname AS customer_name, 
            phone, 
            sbname AS pickup_suburb, 
            dsbname AS destination_suburb,
            pickup_date,  // CORREÇÃO: date -> pickup_date
            pickup_time,  // CORREÇÃO: time -> pickup_time
            status,
            booking_datetime
            FROM bookings
            WHERE status = 'unassigned'
            AND ( 
            (pickup_date = :current_date AND pickup_time >= :current_time) 
            OR 
            (pickup_date = :next_date AND pickup_time <= :two_hours_time)
        )
        ORDER BY pickup_date, pickup_time";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":current_date" => $currentDateString,
                ":current_time" => $currentTime,
                ":next_date" => $nextDate,
                ":two_hours_time" => $twoHoursTime
            ]);
            
            $bookings = [];
            $timeFormat = 'H:i';

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $pickupDateTime = date("d/m/Y H:i", strtotime($row["date"] . " " . $row["time"]));
                $bookings[] = [
                    "booking_ref" => $row["booking_ref"],
                    "customer_name" => $row["customer_name"],
                    "phone" => $row["phone"],
                    "pickup_suburb" => $row["pickup_suburb"],
                    "destination_suburb" => $row["destination_suburb"],
                    "pickup_datetime" => $pickupDateTime,
                    "status" => $row["status"]
                ];
            }

            echo json_encode([
                "success" => true,
                "bookings" => $bookings
            ]);
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "error" => "Failed to search booking records."
        ]);
        exit;
    }
}

function handleAssign($pdo)
{
    $bookingRef = trim($_GET["assign"] ?? "");

    if ($bookingRef === "") {
        echo json_encode([
            "success" => false,
            "error" => "Booking reference number is required."
        ]);
        exit;
    }

    try {
        $sql = "SELECT status FROM bookings WHERE ref_no = :ref_no";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":ref_no" => $bookingRef
        ]);
        
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$booking) {
            echo json_encode([
                "success" => false,
                "error" => "Booking record not found."
            ]);
            exit;
        }

        if (strtolower($booking["status"]) === "assigned") {
            echo json_encode([
                "success" => false,
                "error" => "This booking has already been assigned."
            ]);
            exit;
        }

        $updateSql = "UPDATE bookings SET status = 'assigned' WHERE ref_no = :ref_no";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            ":ref_no" => $bookingRef
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Congratulations! Booking request " . $bookingRef . " has been assigned!"
        ]);
        exit;
        
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "error" => "Failed to assign booking."
        ]);
        exit;
    }
}
?>
