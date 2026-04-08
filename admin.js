/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: admin.js
    Description: This file handles booking searches and taxi assignment
    requests for the admin page using fetch. It handles both reference searches
    and empty searches (within 2 hours of current time).
*/

document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("searchBooking");
    const searchInput = document.getElementById("bsearch");
    const adminMessage = document.getElementById("adminMessage");
    const resultDiv = document.getElementById("result");

    searchButton.addEventListener("click", function() {
        adminMessage.textContent = "";
        resultDiv.innerHTML = "";

        const searchValue = searchInput.value.trim();

        // Validate reference format if search value exists
        if (searchValue !== "") {
            const refPattern = /^BRN\d{5}$/;
            if (!refPattern.test(searchValue)) {
                adminMessage.textContent = "Booking reference number must be in the format BRN00001.";
                return;
            }
        }

        // Build the URL with GET parameters
        const url = new URL("admin.php");
        url.searchParams.append("action", "search");
        
        // Add search parameter if it exists
        if (searchValue) {
            url.searchParams.append("bsearch", searchValue);
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Handle single reference search
                    if (data.bookings && data.bookings.length === 1) {
                        displayBookings(data.bookings);
                    }
                    // Handle empty search (within 2 hours)
                    else if (data.bookings && data.bookings.length > 0) {
                        displayBookings(data.bookings);
                    }
                    // No records found
                    else {
                        adminMessage.textContent = "No booking records found.";
                    }
                } else {
                    adminMessage.textContent = data.error;
                }
            })
            .catch(error => {
                adminMessage.textContent = "An error occurred: " + error.message;
            });
    });

    function displayBookings(bookings) {
        let tableHTML = `
            <table class="booking-table">
                <thead>
                    <tr>
                        <th>Booking reference number</th>
                        <th>Customer name</th>
                        <th>Phone</th>
                        <th>Pickup suburb</th>
                        <th>Destination suburb</th>
                        <th>Pickup date and time</th>
                        <th>Status</th>
                        <th>Assign</th>
                    </tr>
                </thead>
                <tbody>
        `;

        bookings.forEach(function(booking) {
            const isAssigned = booking.status.toLowerCase() === "assigned";

            tableHTML += `
                <tr>
                    <td>${booking.booking_ref}</td>
                    <td>${booking.customer_name}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.pickup_suburb}</td>
                    <td>${booking.destination_suburb}</td>
                    <td>${booking.pickup_datetime}</td>
                    <td id="status-${booking.booking_ref}">${booking.status}</td>
                    <td>
                        <button 
                            type="button" 
                            class="assignButton" 
                            data-ref="${booking.booking_ref}"
                            ${isAssigned ? "disabled" : ""}
                        >
                            Assign
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        resultDiv.innerHTML = tableHTML;

        // Handle assignment buttons
        const assignButtons = document.querySelectorAll(".assignButton");
        assignButtons.forEach(button => {
            button.addEventListener("click", function() {
                assignBooking(this.getAttribute("data-ref"), this);
            });
        });
    }

    function assignBooking(bookingRef, buttonElement) {
        adminMessage.textContent = "";

        // Build URL with GET parameters
        const url = new URL("admin.php");
        url.searchParams.append("action", "assign");
        url.searchParams.append("assign", bookingRef);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    adminMessage.textContent = data.message;

                    // Update status in table
                    const statusCell = document.getElementById("status-" + bookingRef);
                    if (statusCell) {
                        statusCell.textContent = "assigned";
                    }

                    // Disable assignment button
                    buttonElement.disabled = true;
                } else {
                    adminMessage.textContent = data.error;
                }
            })
            .catch(error => {
                adminMessage.textContent = "An error occurred: " + error.message;
            });
    }
});
