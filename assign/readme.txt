Student Name: Ana Carolina Alves de Moura
Student ID: 23201111

File List:
1. booking.html  - Booking page for customers to enter taxi booking details.
2. booking.js    - Client-side validation and asynchronous fetch for booking submission.
3. booking.php   - Server-side script to process bookings, generate reference numbers, and store in MySQL.
4. admin.html    - Admin page for searching and assigning taxi bookings.
5. admin.js      - Client-side logic for admin search (by reference or unassigned within 2 hours) and assign actions.
6. admin.php     - Server-side script for searching bookings and assigning taxis.
7. style.css     - Stylesheet for the booking and admin pages.
8. mysqlcommand.txt - MySQL commands used to create the database and bookings table.
9. readme.txt    - This file containing file descriptions and usage instructions.

Brief Instructions:
1. Open booking.html to submit a taxi booking request.
2. Fill in all required booking details (Name, Phone, Street Number, Street Name, Date, Time).
3. Click the "Book Taxi" button to submit.
4. The system validates inputs, sends data to booking.php via fetch, and displays a confirmation message
   with the booking reference number, pickup time, and pickup date.
5. Open admin.html to manage bookings.
6. Enter a booking reference number (e.g. BRN00001) and click "Search Booking" to find a specific booking.
7. Leave the search field empty and click "Search Booking" to see unassigned bookings within the next 2 hours.
8. Click the "Assign" button on a booking row to assign a taxi. The status updates to "assigned".
