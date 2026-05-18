/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.js
    Description: Client-side validation and asynchronous fetch request
    for booking submission. Pre-fills date and time fields with
    current values on page load.
*/

/**
 * Pads a number with a leading zero if less than 10.
 * @param {number} n - The number to pad.
 * @returns {string} Zero-padded string.
 */
function pad(n) {
    return n < 10 ? "0" + n : String(n);
}

/**
 * Sets the date and time inputs to current date/time on page load.
 */
function prefillDateTime() {
    var now = new Date();
    var dateStr = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    var timeStr = pad(now.getHours()) + ":" + pad(now.getMinutes());

    document.getElementById("pickup-date").value = dateStr;
    document.getElementById("pickup-time").value = timeStr;
}

/**
 * Validates booking form inputs before submission.
 * Checks required fields, phone format, and date/time not in the past.
 * @param {FormData} formData - The form data to validate.
 * @returns {string|null} Error message or null if valid.
 */
function validateForm(formData) {
    var cname = (formData.get("cname") || "").trim();
    var phone = (formData.get("phone") || "").trim();
    var snumber = (formData.get("snumber") || "").trim();
    var stname = (formData.get("stname") || "").trim();
    var date = (formData.get("date") || "").trim();
    var time = (formData.get("time") || "").trim();

    if (!cname || !phone || !snumber || !stname || !date || !time) {
        return "Please fill in all required fields.";
    }

    //  Allow only digits, length between 10 and 12
    if (!/^\d{10,12}$/.test(phone)) {
        return "Phone number must be 10-12 digits only.";
    }

    // Combine date and time to create a Date object for validation
    var pickupDT = new Date(date + "T" + time);
    var now = new Date();

    if (isNaN(pickupDT.getTime())) {
        return "Invalid date or time format.";
    }

    if (pickupDT < now) {
        return "Pick-up date and time must not be earlier than current date and time.";
    }

    return null;
}

/**
 * Displays the booking confirmation message inside the p#reference element.
 * @param {Object} data - Server response containing bookingRef, pickupDate, pickupTime.
 */
function displayConfirmation(data) {
    var refEl = document.getElementById("reference");
    refEl.className = "";
    refEl.innerHTML =
        "Thank you for your booking!<br>" +
        "Booking reference number: " + data.bookingRef + "<br>" +
        "Pickup time: " + data.pickupTime + "<br>" +
        "Pickup date: " + data.pickupDate;
}

/**
 * Displays an error or status message inside the p#reference element.
 * @param {string} text - The message to display.
 */
function displayError(text) {
    var refEl = document.getElementById("reference");
    refEl.className = "error";
    refEl.innerHTML = text;
}

// Initialize form and event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    prefillDateTime();

    document.getElementById("booking-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        var refEl = document.getElementById("reference");
        refEl.innerHTML = "";
        refEl.className = "";

        var formData = new FormData(e.target);
        var error = validateForm(formData);

        if (error) {
            displayError(error);
            return;
        }

        try {
            var response = await fetch("booking.php", {
                method: "POST",
                body: formData
            });

            var result = await response.json();

            if (result.success) {
                displayConfirmation(result);
                e.target.reset();
                prefillDateTime();
            } else {
                displayError(result.error || "Booking failed.");
            }
        } catch (err) {
            displayError("Connection error. Please try again.");
        }
    });
});
