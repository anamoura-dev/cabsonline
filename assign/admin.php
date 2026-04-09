<?php
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: admin.php
    Description: Server-side script for the admin page. Handles booking
    searches (by reference number or unassigned within 2 hours)
    and taxi assignment (updating status to "assigned").
*/

header("Content-Type: application/json");

$host = "webdev.aut.ac.nz";
$dbname = "bvf2703";
$username = "bvf2703";
$password = "tuumyvkdsxafwxfcgajytsmtgppzqngwp";

/**
 * Creates a PDO database connection.
 * @return PDO|null Returns PDO instance or null on failure.
 */
function getConnection($host, $dbname, $username, $password)
{
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

$pdo = getConnection($host, $dbname, $username, $password);

if (!$pdo) {
    echo json_encode(["success" => false, "error" => "Database connection failed."]);
    exit;
}

$action = $_GET["action"] ?? "";

if ($action === "search") {
    handleSearch($pdo);
} elseif ($action === "assign") {
    handleAssign($pdo);
} else {
    echo json_encode(["success" => false, "error" => "Invalid request."]);
    exit;
}

/**
 * Handles booking search requests.
 * If bsearch is provided, returns the exact matching record.
 * If bsearch is empty, returns unassigned bookings with pickup within 2 hours.
 * @param PDO $pdo Database connection.
 */
function handleSearch($pdo)
{
    $bsearch = trim($_GET["bsearch"] ?? "");

    try {
        if ($bsearch !== "") {
            if (!preg_match("/^BRN\d{5}$/", $bsearch)) {
                echo json_encode(["success" => false, "error" => "Invalid booking reference number format."]);
                exit;
            }

            $sql = "SELECT
                        booking_ref, customer_name, phone,
                        suburb AS pickup_suburb, destination_suburb,
                        pickup_date, pickup_time, status
                    FROM bookings
                    WHERE booking_ref = :ref";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([":ref" => $bsearch]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                echo json_encode(["success" => false, "error" => "Booking reference number not found."]);
                exit;
            }

            $row["pickup_datetime"] = date("d/m/Y H:i", strtotime($row["pickup_date"] . " " . $row["pickup_time"]));

            echo json_encode(["success" => true, "bookings" => [$row]]);
            exit;
        }

        /* Empty search: unassigned bookings with pickup within next 2 hours */
        $now = new DateTime();
        $twoHoursLater = clone $now;
        $twoHoursLater->modify("+2 hours");

        $sql = "SELECT
                    booking_ref, customer_name, phone,
                    suburb AS pickup_suburb, destination_suburb,
                    pickup_date, pickup_time, status
                FROM bookings
                WHERE status = 'unassigned'
                  AND CONCAT(pickup_date, ' ', pickup_time) >= :now
                  AND CONCAT(pickup_date, ' ', pickup_time) <= :later
                ORDER BY pickup_date, pickup_time";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":now"   => $now->format("Y-m-d H:i:s"),
            ":later" => $twoHoursLater->format("Y-m-d H:i:s")
        ]);

        $bookings = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["pickup_datetime"] = date("d/m/Y H:i", strtotime($row["pickup_date"] . " " . $row["pickup_time"]));
            $bookings[] = $row;
        }

        echo json_encode(["success" => true, "bookings" => $bookings]);
        exit;

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to search booking records."]);
        exit;
    }
}

/**
 * Handles taxi assignment requests.
 * Updates the booking status from "unassigned" to "assigned" and
 * returns a confirmation message with the booking reference number.
 * @param PDO $pdo Database connection.
 */
function handleAssign($pdo)
{
    $bookingRef = trim($_GET["assign"] ?? "");

    if ($bookingRef === "") {
        echo json_encode(["success" => false, "error" => "Booking reference number is required."]);
        exit;
    }

    try {
        $sql = "SELECT status FROM bookings WHERE booking_ref = :ref";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([":ref" => $bookingRef]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            echo json_encode(["success" => false, "error" => "Booking record not found."]);
            exit;
        }

        if (strtolower($booking["status"]) === "assigned") {
            echo json_encode(["success" => false, "error" => "This booking has already been assigned."]);
            exit;
        }

        $updateSql = "UPDATE bookings SET status = 'assigned' WHERE booking_ref = :ref";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([":ref" => $bookingRef]);

        echo json_encode([
            "success" => true,
            "message" => "Congratulations! Booking request " . $bookingRef . " has been assigned!"
        ]);
        exit;

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to assign booking."]);
        exit;
    }
}
?>
