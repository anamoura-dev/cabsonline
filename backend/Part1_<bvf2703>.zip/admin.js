/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: admin.js
    Description: Client-side logic for the admin page. Handles booking
    searches (by reference or empty for unassigned within 2 hours)
    and taxi assignment actions using asynchronous fetch requests.
*/

document.addEventListener("DOMContentLoaded", function () {

    // Get references to key DOM elements for interaction
    var searchButton = document.getElementById("sbutton");
    var searchInput = document.getElementById("bsearch");
    var adminMessage = document.getElementById("adminMessage");
    var resultDiv = document.getElementById("result");

    /**
     * Displays a message in the admin message area.
     * @param {string} text - Message text.
     * @param {boolean} isError - Whether the message is an error.
     */
    function showMessage(text, isError) {
        adminMessage.textContent = text;
        adminMessage.className = isError ? "message error" : "message success";
    }

    /**
     * Fetches bookings from the server and renders the results table.
     * @param {string} searchValue - Reference number or empty string.
     */
    function searchBookings(searchValue) {
        adminMessage.textContent = "";
        resultDiv.innerHTML = "";

        var url = "admin.php?action=search";
        if (searchValue) {
            url += "&bsearch=" + encodeURIComponent(searchValue);
        }

        // Send a GET request to the server to search for bookings
        fetch(url)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                // Check if the search was successful and if there are bookings to display
                if (data.success && data.bookings && data.bookings.length > 0) {
                    displayBookings(data.bookings);
                    // If no bookings are found but the search was successful, show a message
                } else if (data.success) {
                    showMessage("No booking records found.", false);
                    // If the search was not successful, show an error message
                } else {
                    showMessage(data.error || "Search failed.", true);
                }
            })
            // Handle any network or unexpected errors during the fetch operation
            .catch(function (err) {
                showMessage("An error occurred: " + err.message, true);
            });
    }

    /**
     * Renders a table of booking records inside the results div.
     * @param {Array} bookings - Array of booking objects from server.
     */
    function displayBookings(bookings) {
        var html = '<table class="booking-table">' +
            "<thead><tr>" +
            "<th>Booking reference number</th>" +
            "<th>Customer name</th>" +
            "<th>Phone</th>" +
            "<th>Pickup suburb</th>" +
            "<th>Destination suburb</th>" +
            "<th>Pickup date and time</th>" +
            "<th>Status</th>" +
            "<th>Assign</th>" +
            "</tr></thead><tbody>";

        // Loop through each booking and create a table row with its details and an assign button
        for (var i = 0; i < bookings.length; i++) {
            var b = bookings[i];
            var isAssigned = b.status.toLowerCase() === "assigned";

            // Create a table row for each booking with its details and an assign button
            html += "<tr>" +
                "<td>" + b.booking_ref + "</td>" +
                "<td>" + b.customer_name + "</td>" +
                "<td>" + b.phone + "</td>" +
                "<td>" + (b.pickup_suburb || "") + "</td>" +
                "<td>" + (b.destination_suburb || "") + "</td>" +
                "<td>" + b.pickup_datetime + "</td>" +
                '<td id="status-' + b.booking_ref + '">' + b.status + "</td>" +
                "<td>" +
                '<input type="button" name="Assign" class="assignButton" ' +
                'data-ref="' + b.booking_ref + '" value="Assign"' +
                (isAssigned ? " disabled" : "") + ">" +
                "</td></tr>";
        }
        // Close the table and set the inner HTML of the results div to display the bookings
        html += "</tbody></table>";
        resultDiv.innerHTML = html;

        // Add click event listeners to all assign buttons in the rendered table
        var buttons = resultDiv.querySelectorAll(".assignButton");
        for (var j = 0; j < buttons.length; j++) {
            buttons[j].addEventListener("click", function () {
                assignBooking(this.getAttribute("data-ref"), this);
            });
        }
    }

    /**
     * Sends an assign request to the server and updates the UI.
     * @param {string} ref - Booking reference number.
     * @param {HTMLElement} btn - The clicked assign button element.
     */
    function assignBooking(ref, btn) {
        // Clear any existing messages before sending the assign request
        adminMessage.textContent = "";

        // Send a GET request to the server to assign the booking with the given reference number
        fetch("admin.php?action=assign&assign=" + encodeURIComponent(ref))
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.success) {
                    showMessage(data.message, false);
                    var cell = document.getElementById("status-" + ref);
                    if (cell) cell.textContent = "assigned";
                    btn.disabled = true;
                } else {
                    showMessage(data.error || "Assignment failed.", true);
                }
            })
            .catch(function (err) {
                showMessage("An error occurred: " + err.message, true);
            });
    }

    // Add click event listener to the search button to trigger the booking search
    searchButton.addEventListener("click", function () {
        var value = searchInput.value.trim();

        // Validate the booking reference number format if a value is entered
        if (value !== "") {
            if (!/^BRN\d{5}$/.test(value)) {
                showMessage("Booking reference number must be in the format BRN00001.", true);
                return;
            }
        }
        // Trigger the search for bookings based on the input value (reference number or empty for unassigned)
        searchBookings(value);
    });
});
