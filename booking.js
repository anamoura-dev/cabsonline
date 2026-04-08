/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: booking.js
    Description: This file handles client-side validation and sends booking
    data asynchronously to the server using fetch.
*/

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side validation
    const phone = document.querySelector('input[name="phone"]').value;
    if (!/^\d{10,12}$/.test(phone)) {
        alert("Phone must be 10-12 digits!");
        return;
    }

    // Get current date/time for min constraint
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    const formData = new FormData(e.target);
    const date = new Date(formData.get('date'));
    const time = new Date(formData.get('time'));

    // Validate date/time not in past
    if (date < minDate || (date.getTime() == minDate.getTime() && time < minTime)) {
        alert("Pickup date/time cannot be in the past!");
        return;
    }

    // Submit via Fetch
    const response = await fetch('booking.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        displayConfirmation(result);
    }
});

function displayConfirmation(data) {
    const ref = data.bookingRef;
    const time = data.pickupTime;
    const date = data.pickupDate;
    const html = `
        <p id="reference">
            Thank you for your booking!<br>
            Booking reference number: ${ref}<br>
            Pickup time: ${time}<br>
            Pickup date: ${date}
        </p>
    `;
    document.getElementById('reference').innerHTML = html;
}
