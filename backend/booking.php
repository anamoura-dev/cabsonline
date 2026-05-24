<?php
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.php
    Description: This file receives booking data from booking.js, validates it,
    generates a unique booking reference number, stores the booking in the
    MySQL database, and returns a JSON response to the client.
*/

require_once __DIR__ . '/includes/bootstrap.php';

try {
    $pdo = cabsonline_pdo();
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

// Date/Time validation
$pickupDateTime = new DateTime("$date $time");
$currentDateTime = new DateTime();

if ($pickupDateTime < $currentDateTime) {
    echo json_encode([
        "success" => false,
        "error" => "Pick-up date/time cannot be in the past."
    ]);
    exit;
}

// Truncate to match column limits
$cname   = substr($cname, 0, 100);
$phone   = substr($phone, 0, 12);
$unumber = substr($unumber, 0, 20);
$snumber = substr($snumber, 0, 20);
$stname  = substr($stname, 0, 100);
$sbname  = substr($sbname, 0, 100);
$dsbname = substr($dsbname, 0, 100);

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

