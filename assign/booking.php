<?php
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.php
    Description: Server-side script that receives booking data from booking.js,
    validates inputs, generates a unique booking reference number (BRN format),
    stores the booking in the MySQL database, and returns a JSON response.
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

$cname   = trim($_POST["cname"] ?? "");
$phone   = trim($_POST["phone"] ?? "");
$unumber = trim($_POST["unumber"] ?? "");
$snumber = trim($_POST["snumber"] ?? "");
$stname  = trim($_POST["stname"] ?? "");
$sbname  = trim($_POST["sbname"] ?? "");
$dsbname = trim($_POST["dsbname"] ?? "");
$date    = trim($_POST["date"] ?? "");
$time    = trim($_POST["time"] ?? "");

/* Truncate to match column limits */
$cname   = substr($cname, 0, 100);
$phone   = substr($phone, 0, 12);
$unumber = substr($unumber, 0, 20);
$snumber = substr($snumber, 0, 20);
$stname  = substr($stname, 0, 100);
$sbname  = substr($sbname, 0, 100);
$dsbname = substr($dsbname, 0, 100);

/* Validate required fields */
if ($cname === "" || $phone === "" || $snumber === "" || $stname === "" || $date === "" || $time === "") {
    echo json_encode(["success" => false, "error" => "Missing required fields."]);
    exit;
}

/* Validate phone format: 10-12 digits */
if (!preg_match("/^[0-9]{10,12}$/", $phone)) {
    echo json_encode(["success" => false, "error" => "Invalid phone number format."]);
    exit;
}

/* Validate pickup date/time is not in the past */
$pickupDateTime = new DateTime("$date $time");
$currentDateTime = new DateTime();

if ($pickupDateTime < $currentDateTime) {
    echo json_encode(["success" => false, "error" => "Pick-up date/time cannot be in the past."]);
    exit;
}

/**
 * Generates the next incremental booking reference number (BRN00001 format).
 * @param PDO $pdo Database connection.
 * @return string The generated reference number.
 */
function generateBookingRef($pdo)
{
    $stmt = $pdo->query("SELECT COUNT(*) FROM bookings");
    $count = $stmt->fetchColumn();
    return "BRN" . str_pad($count + 1, 5, "0", STR_PAD_LEFT);
}

$bookingRef = generateBookingRef($pdo);
$bookingDateTime = date("Y-m-d H:i:s");

$sql = "INSERT INTO bookings (
    booking_ref, customer_name, phone, unit_number,
    street_number, street_name, suburb, destination_suburb,
    pickup_date, pickup_time, status, booking_datetime
) VALUES (
    :booking_ref, :customer_name, :phone, :unit_number,
    :street_number, :street_name, :suburb, :destination_suburb,
    :pickup_date, :pickup_time, :status, :booking_datetime
)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":booking_ref"      => $bookingRef,
        ":customer_name"    => $cname,
        ":phone"            => $phone,
        ":unit_number"      => $unumber,
        ":street_number"    => $snumber,
        ":street_name"      => $stname,
        ":suburb"           => $sbname,
        ":destination_suburb" => $dsbname,
        ":pickup_date"      => $date,
        ":pickup_time"      => $time,
        ":status"           => "unassigned",
        ":booking_datetime" => $bookingDateTime
    ]);

    echo json_encode([
        "success"     => true,
        "bookingRef"  => $bookingRef,
        "pickupDate"  => date("d/m/Y", strtotime($date)),
        "pickupTime"  => date("H:i", strtotime($time))
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Failed to save booking."]);
}
?>
