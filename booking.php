<?php
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.php
    Description: This file receives booking data from booking.js, validates it,
    generates a unique booking reference number, stores the booking in the
    MySQL database, and returns a JSON response to the client.
*/
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

$cname = trim($_POST["cname"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$unumber = trim($_POST["unumber"] ?? "");
$snumber = trim($_POST["snumber"] ?? "");
$stname = trim($_POST["stname"] ?? "");
$sbname = trim($_POST["sbname"] ?? "");
$dsbname = trim($_POST["dsbname"] ?? "");
$date = trim($_POST["date"] ?? "");
$time = trim($_POST["time"] ?? "");

// Required validation
if ($cname === "" || $phone === "" || $snumber === "" || $stname === "" || $date === "" || $time === "") {
    echo json_encode([
        "success" => false,
        "error" => "Missing required fields."
    ]);
    exit;
}

// Phone validation
if (!preg_match("/^[0-9]{10,12}$/", $phone)) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid phone number format."
    ]);
    exit;
}

// Date/Time validation (handles wrap-around)
$pickupDateTime = new DateTime("$date $time");
$currentDateTime = new DateTime();
$twoHoursLater = $currentDateTime->modify('+2 hours');

// Handle time wrap-around case
if ($pickupDateTime > $twoHoursLater) {
    echo json_encode([
        "success" => false,
        "error" => "Pick-up time must be within next 2 hours from current time."
    ]);
    exit;
}

// Generate reference number
$stmt2 = $pdo->query("SELECT COUNT(*) FROM bookings");
$count = $stmt2->fetchColumn();
$bookingRef = "BRN" . str_pad($count + 1, 5, "0", STR_PAD_LEFT);

// Prepare insert
$bookingDateTime = date('Y-m-d H:i:s');
$bookingData = [
    "booking_ref" => $bookingRef,
    "customer_name" => $cname,
    "phone" => $phone,
    "unit_number" => $unumber,
    "street_number" => $snumber,
    "street_name" => $stname,
    "suburb" => $sbname,
    "destination_suburb" => $dsbname,
    "pickup_date" => $date,
    "pickup_time" => $time,
    "status" => "unassigned",
    "booking_datetime" => $bookingDateTime
];

$sql = "INSERT INTO bookings (
    booking_ref,
    customer_name,
    phone,
    unit_number,
    street_number,
    street_name,
    suburb,
    destination_suburb,
    pickup_date,
    pickup_time,
    status,
    booking_datetime
) VALUES (
    :booking_ref,
    :customer_name,
    :phone,
    :unit_number,
    :street_number,
    :street_name,
    :suburb,
    :destination_suburb,
    :pickup_date,
    :pickup_time,
    :status,
    :booking_datetime
)";

$stmt = $pdo->prepare($sql);
$stmt->execute($bookingData);

// Format response
echo json_encode([
    "success" => true,
    "bookingRef" => $bookingRef,
    "pickupDate" => date("d/m/Y", strtotime($date)),
    "pickupTime" => date("H:i", strtotime($time))
]);
?>

