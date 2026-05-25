/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.js
    Description: Handles the booking form submission on the Part 1 HTML page.
    Validates phone number and pickup date/time on the client side before
    sending the form data to booking.php via fetch.
*/
document.getElementById("booking-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    var refDiv = document.getElementById("reference");
    refDiv.innerHTML = "";
    refDiv.className = "confirmation";

    var form = e.target;
    var phone = form.querySelector('input[name="phone"]').value.trim();

    // Validate phone format before sending to avoid unnecessary server round-trips
    if (!/^\d{10,12}$/.test(phone)) {
        showMessage(refDiv, "Phone must be 10–12 digits.", true);
        return;
    }

    var dateVal = form.querySelector('input[name="date"]').value;
    var timeVal = form.querySelector('input[name="time"]').value;

    if (!dateVal || !timeVal) {
        showMessage(refDiv, "Please fill in pickup date and time.", true);
        return;
    }

    var pickupDT = new Date(dateVal + "T" + timeVal);
    var now = new Date();

    if (isNaN(pickupDT.getTime())) {
        showMessage(refDiv, "Invalid date or time.", true);
        return;
    }

    if (pickupDT < now) {
        showMessage(refDiv, "Pickup date/time cannot be in the past.", true);
        return;
    }

    try {
        var response = await fetch("booking.php", {
            method: "POST",
            body: new FormData(form)
        });

        var result = await response.json();

        if (result.success) {
            form.style.display = "none";
            refDiv.innerHTML =
                '<div class="success-card">' +
                '<div class="success-icon"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg></div>' +
                '<h2>Booking Confirmed!</h2>' +
                '<p>Thank you for choosing CabsOnline.</p>' +
                '<div class="success-details">' +
                '<div class="booking-field"><span class="booking-field-label">Reference</span><span class="booking-field-value">' + result.bookingRef + '</span></div>' +
                '<div class="booking-field"><span class="booking-field-label">Pickup Date</span><span class="booking-field-value">' + result.pickupDate + '</span></div>' +
                '<div class="booking-field"><span class="booking-field-label">Pickup Time</span><span class="booking-field-value">' + result.pickupTime + '</span></div>' +
                '</div>' +
                '<button type="button" id="newBookingBtn">New Booking</button>' +
                '</div>';
            document.getElementById("newBookingBtn").addEventListener("click", function () {
                form.reset();
                form.style.display = "";
                refDiv.innerHTML = "";
            });
        } else {
            showMessage(refDiv, result.error || "Booking failed.", true);
        }
    } catch (err) {
        showMessage(refDiv, "Connection error. Please try again.", true);
    }
});

function showMessage(el, text, isError) {
    el.className = "confirmation" + (isError ? " error" : "");
    el.textContent = text;
}
