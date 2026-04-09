/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: admin.js
    Description: Client-side logic for the admin page. Handles booking
    searches (by reference or empty for unassigned within 2 hours)
    and taxi assignment actions using asynchronous fetch requests.
*/

document.addEventListener("DOMContentLoaded", function () {
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

        fetch(url)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.success && data.bookings && data.bookings.length > 0) {
                    displayBookings(data.bookings);
                } else if (data.success) {
                    showMessage("No booking records found.", false);
                } else {
                    showMessage(data.error || "Search failed.", true);
                }
            })
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

        for (var i = 0; i < bookings.length; i++) {
            var b = bookings[i];
            var isAssigned = b.status.toLowerCase() === "assigned";

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

        html += "</tbody></table>";
        resultDiv.innerHTML = html;

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
        adminMessage.textContent = "";

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

    searchButton.addEventListener("click", function () {
        var value = searchInput.value.trim();

        if (value !== "") {
            if (!/^BRN\d{5}$/.test(value)) {
                showMessage("Booking reference number must be in the format BRN00001.", true);
                return;
            }
        }

        searchBookings(value);
    });
});
