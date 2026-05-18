<?php
header("Content-Type: application/json");

require_once __DIR__ . '/includes/bootstrap.php';

try {
    $pdo = cabsonline_pdo();
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed."]);
    exit;
}

$action = $_GET["action"] ?? $_POST["action"] ?? "";

switch ($action) {
    case "list":    handleList($pdo);   break;
    case "search":  handleSearch($pdo); break;
    case "assign":  handleAssign($pdo); break;
    case "update":  handleUpdate($pdo); break;
    case "delete":  handleDelete($pdo); break;
    default:
        echo json_encode(["success" => false, "error" => "Invalid action."]);
}

function handleList($pdo)
{
    try {
        $sql = "SELECT
                    id, booking_ref, customer_name, phone,
                    unit_number, street_number, street_name,
                    suburb, destination_suburb,
                    pickup_date, pickup_time, status, booking_datetime
                FROM bookings
                ORDER BY booking_datetime DESC";

        $stmt = $pdo->query($sql);
        $bookings = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["pickup_datetime"] = date("d/m/Y H:i", strtotime($row["pickup_date"] . " " . $row["pickup_time"]));
            $bookings[] = $row;
        }

        echo json_encode(["success" => true, "bookings" => $bookings]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to list bookings."]);
    }
}

function handleSearch($pdo)
{
    $bsearch = trim($_GET["bsearch"] ?? "");

    try {
        if ($bsearch === "") {
            handleList($pdo);
            return;
        }

        if (!preg_match("/^BRN\d{5}$/", $bsearch)) {
            echo json_encode(["success" => false, "error" => "Invalid format. Use BRN00001."]);
            exit;
        }

        $sql = "SELECT
                    id, booking_ref, customer_name, phone,
                    unit_number, street_number, street_name,
                    suburb, destination_suburb,
                    pickup_date, pickup_time, status, booking_datetime
                FROM bookings
                WHERE booking_ref = :ref";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([":ref" => $bsearch]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            echo json_encode(["success" => false, "error" => "Booking not found."]);
            exit;
        }

        $row["pickup_datetime"] = date("d/m/Y H:i", strtotime($row["pickup_date"] . " " . $row["pickup_time"]));

        echo json_encode(["success" => true, "bookings" => [$row]]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Search failed."]);
    }
}

function handleAssign($pdo)
{
    $ref = trim($_GET["ref"] ?? "");
    $newStatus = trim($_GET["status"] ?? "");

    if ($ref === "" || !in_array($newStatus, ["assigned", "unassigned"])) {
        echo json_encode(["success" => false, "error" => "Invalid parameters."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE bookings SET status = :status WHERE booking_ref = :ref");
        $stmt->execute([":status" => $newStatus, ":ref" => $ref]);

        if ($stmt->rowCount() === 0) {
            echo json_encode(["success" => false, "error" => "Booking not found."]);
            exit;
        }

        echo json_encode(["success" => true, "message" => "Status updated to " . $newStatus . ".", "status" => $newStatus]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to update status."]);
    }
}

function handleUpdate($pdo)
{
    $ref            = trim($_POST["ref"] ?? "");
    $customerName   = trim($_POST["customer_name"] ?? "");
    $phone          = trim($_POST["phone"] ?? "");
    $unitNumber     = trim($_POST["unit_number"] ?? "");
    $streetNumber   = trim($_POST["street_number"] ?? "");
    $streetName     = trim($_POST["street_name"] ?? "");
    $suburb         = trim($_POST["suburb"] ?? "");
    $destSuburb     = trim($_POST["destination_suburb"] ?? "");
    $pickupDate     = trim($_POST["pickup_date"] ?? "");
    $pickupTime     = trim($_POST["pickup_time"] ?? "");

    if ($ref === "" || $customerName === "" || $phone === "" || $streetNumber === "" || $streetName === "" || $pickupDate === "" || $pickupTime === "") {
        echo json_encode(["success" => false, "error" => "Missing required fields."]);
        exit;
    }

    if (!preg_match("/^[0-9]{10,12}$/", $phone)) {
        echo json_encode(["success" => false, "error" => "Phone must be 10–12 digits."]);
        exit;
    }

    try {
        $sql = "UPDATE bookings SET
                    customer_name = :customer_name,
                    phone = :phone,
                    unit_number = :unit_number,
                    street_number = :street_number,
                    street_name = :street_name,
                    suburb = :suburb,
                    destination_suburb = :destination_suburb,
                    pickup_date = :pickup_date,
                    pickup_time = :pickup_time
                WHERE booking_ref = :ref";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":customer_name"     => $customerName,
            ":phone"             => $phone,
            ":unit_number"       => $unitNumber,
            ":street_number"     => $streetNumber,
            ":street_name"       => $streetName,
            ":suburb"            => $suburb,
            ":destination_suburb"=> $destSuburb,
            ":pickup_date"       => $pickupDate,
            ":pickup_time"       => $pickupTime,
            ":ref"               => $ref
        ]);

        if ($stmt->rowCount() === 0) {
            echo json_encode(["success" => false, "error" => "Booking not found or no changes."]);
            exit;
        }

        echo json_encode(["success" => true, "message" => "Booking " . $ref . " updated."]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to update booking."]);
    }
}

function handleDelete($pdo)
{
    $ref = trim($_GET["ref"] ?? "");

    if ($ref === "") {
        echo json_encode(["success" => false, "error" => "Booking reference is required."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE booking_ref = :ref");
        $stmt->execute([":ref" => $ref]);

        if ($stmt->rowCount() === 0) {
            echo json_encode(["success" => false, "error" => "Booking not found."]);
            exit;
        }

        echo json_encode(["success" => true, "message" => "Booking " . $ref . " deleted."]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Failed to delete booking."]);
    }
}
?>
