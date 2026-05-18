document.addEventListener("DOMContentLoaded", function () {
    var searchButton = document.getElementById("searchBooking");
    var searchInput = document.getElementById("bsearch");
    var adminMessage = document.getElementById("adminMessage");
    var resultDiv = document.getElementById("result");
    var modal = document.getElementById("editModal");
    var editForm = document.getElementById("editForm");
    var closeModal = document.getElementById("closeModal");

    if (!searchButton) return;

    loadBookings();

    searchButton.addEventListener("click", function () {
        var val = searchInput.value.trim();
        if (val !== "" && !/^BRN\d{5}$/.test(val)) {
            showMsg("Format must be BRN00001.", true);
            return;
        }
        loadBookings(val);
    });

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") searchButton.click();
    });

    closeModal.addEventListener("click", function () {
        modal.classList.remove("open");
    });

    var closeModal2 = document.getElementById("closeModal2");
    if (closeModal2) {
        closeModal2.addEventListener("click", function () {
            modal.classList.remove("open");
        });
    }

    modal.addEventListener("click", function (e) {
        if (e.target === modal) modal.classList.remove("open");
    });

    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(editForm);
        formData.append("action", "update");

        fetch("admin.php", { method: "POST", body: formData })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success) {
                    showMsg(data.message, false);
                    modal.classList.remove("open");
                    loadBookings();
                } else {
                    showMsg(data.error, true);
                }
            })
            .catch(function (err) { showMsg("Error: " + err.message, true); });
    });

    function showMsg(text, isError) {
        adminMessage.textContent = text;
        adminMessage.className = "message" + (isError ? " msg-error" : " msg-success");
    }

    function loadBookings(ref) {
        adminMessage.textContent = "";
        resultDiv.innerHTML = "";

        var url = ref
            ? "admin.php?action=search&bsearch=" + encodeURIComponent(ref)
            : "admin.php?action=list";

        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success && data.bookings && data.bookings.length > 0) {
                    renderCards(data.bookings);
                } else if (data.success) {
                    showMsg("No bookings found.", false);
                } else {
                    showMsg(data.error || "Load failed.", true);
                }
            })
            .catch(function (err) { showMsg("Connection error: " + err.message, true); });
    }

    function renderCards(bookings) {
        var html = '<div class="booking-grid">';

        for (var i = 0; i < bookings.length; i++) {
            var b = bookings[i];
            var isAssigned = b.status.toLowerCase() === "assigned";
            var badgeClass = isAssigned ? "badge badge-assigned" : "badge badge-unassigned";
            var toggleLabel = isAssigned ? "Unassign" : "Assign";
            var toggleStatus = isAssigned ? "unassigned" : "assigned";

            html += '<div class="booking-card" id="row-' + b.booking_ref + '">' +
                '<div class="booking-card-header">' +
                '<span class="booking-card-ref">' + b.booking_ref + '</span>' +
                '<span class="' + badgeClass + '" id="badge-' + b.booking_ref + '">' + b.status + '</span>' +
                '</div>' +
                '<div class="booking-card-body">' +
                field("Customer", b.customer_name) +
                field("Phone", b.phone) +
                field("Pickup", b.suburb || "-") +
                field("Destination", b.destination_suburb || "-") +
                field("Date/Time", b.pickup_datetime) +
                field("Address", (b.unit_number ? b.unit_number + "/" : "") + b.street_number + " " + b.street_name) +
                '</div>' +
                '<div class="booking-card-actions">' +
                '<button type="button" class="btn-edit" data-booking=\'' + JSON.stringify(b).replace(/'/g, "&#39;") + '\'>Edit</button>' +
                '<button type="button" class="btn-toggle" data-ref="' + b.booking_ref + '" data-status="' + toggleStatus + '">' + toggleLabel + '</button>' +
                '<button type="button" class="btn-delete" data-ref="' + b.booking_ref + '">Delete</button>' +
                '</div></div>';
        }

        html += '</div>';
        resultDiv.innerHTML = html;

        var editBtns = resultDiv.querySelectorAll(".btn-edit");
        for (var e = 0; e < editBtns.length; e++) {
            editBtns[e].addEventListener("click", handleEdit);
        }

        var toggleBtns = resultDiv.querySelectorAll(".btn-toggle");
        for (var j = 0; j < toggleBtns.length; j++) {
            toggleBtns[j].addEventListener("click", handleToggle);
        }

        var delBtns = resultDiv.querySelectorAll(".btn-delete");
        for (var k = 0; k < delBtns.length; k++) {
            delBtns[k].addEventListener("click", handleDelete);
        }
    }

    function field(label, value) {
        return '<div class="booking-field">' +
            '<span class="booking-field-label">' + label + '</span>' +
            '<span class="booking-field-value">' + value + '</span>' +
            '</div>';
    }

    function handleEdit() {
        var b = JSON.parse(this.getAttribute("data-booking"));
        document.getElementById("edit-ref").value = b.booking_ref;
        document.getElementById("edit-ref-display").textContent = b.booking_ref;
        document.getElementById("edit-customer_name").value = b.customer_name;
        document.getElementById("edit-phone").value = b.phone;
        document.getElementById("edit-unit_number").value = b.unit_number || "";
        document.getElementById("edit-street_number").value = b.street_number;
        document.getElementById("edit-street_name").value = b.street_name;
        document.getElementById("edit-suburb").value = b.suburb || "";
        document.getElementById("edit-destination_suburb").value = b.destination_suburb || "";
        document.getElementById("edit-pickup_date").value = b.pickup_date;
        document.getElementById("edit-pickup_time").value = b.pickup_time;
        modal.classList.add("open");
    }

    function handleToggle() {
        var ref = this.getAttribute("data-ref");
        var newStatus = this.getAttribute("data-status");
        var btn = this;

        fetch("admin.php?action=assign&ref=" + encodeURIComponent(ref) + "&status=" + encodeURIComponent(newStatus))
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success) {
                    showMsg(data.message, false);
                    var badge = document.getElementById("badge-" + ref);
                    if (badge) {
                        badge.textContent = data.status;
                        badge.className = data.status === "assigned" ? "badge badge-assigned" : "badge badge-unassigned";
                    }
                    var isNow = data.status === "assigned";
                    btn.textContent = isNow ? "Unassign" : "Assign";
                    btn.setAttribute("data-status", isNow ? "unassigned" : "assigned");
                } else {
                    showMsg(data.error, true);
                }
            })
            .catch(function (err) { showMsg("Error: " + err.message, true); });
    }

    function handleDelete() {
        var ref = this.getAttribute("data-ref");
        if (!confirm("Delete booking " + ref + "? This cannot be undone.")) return;

        fetch("admin.php?action=delete&ref=" + encodeURIComponent(ref))
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success) {
                    showMsg(data.message, false);
                    var row = document.getElementById("row-" + ref);
                    if (row) row.remove();
                } else {
                    showMsg(data.error, true);
                }
            })
            .catch(function (err) { showMsg("Error: " + err.message, true); });
    }
});
