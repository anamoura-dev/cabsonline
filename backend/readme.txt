Student Name: Ana Carolina Alves de Moura
Student ID: 23201111


File List
---------
1.  index.html         Main entry point for the single-page application.
2.  booking.html       Booking form page for customers.
3.  booking.js         Client-side validation and fetch request for bookings.
4.  booking.php        Processes booking submissions, generates reference numbers and saves to the database.
5.  admin.html         Admin page for searching and assigning bookings.
6.  admin.js           Client-side logic for the admin search and assign flow.
7.  admin.php          Handles all admin actions: search, assign, list, update and delete.
8.  app.js             Handles theme toggle and section switching for the SPA.
9.  style.css          Stylesheet for all pages.
10. mysqlcommand.txt   SQL commands to create the database and bookings table.
11. readme.txt         This file.
12. .env.example       Template for local database credentials.
13. .gitignore         Git ignore rules.
14. includes/bootstrap.php   Loads the .env file and returns a PDO database connection.
15. DOC/README.md      Full project documentation.


How to Run Locally
------------------
You need PHP 8.x (with pdo_mysql) and MySQL 8.x running on localhost.

1. Create the database:
mysql -u root -e "SOURCE mysqlcommand.txt"

2. Copy .env.example to .env and fill in your local MySQL credentials.

3. Start the PHP server from the backend folder:
   php -S localhost:8080

4. Open in the browser:
   http://localhost:8080/booking.html  (booking form)
   http://localhost:8080/admin.html    (admin panel)

To deploy to webdev.aut.ac.nz, upload all files to htdocs/ via SFTP and run
the SQL from mysqlcommand.txt on the webdev MySQL server.


How to Use the System
---------------------
Booking a taxi:
Open booking.html, fill in your name, phone number, pickup address, and
choose a date and time in the future. Click "Book Taxi". If everything is
valid the page shows a confirmation with your booking reference number
(e.g. BRN00001), keep this for your records.

Admin panel:
Open admin.html. Type a booking reference in the search box to find a
specific booking, or leave it empty and click Search to see all unassigned
bookings due in the next 2 hours. Click "Assign" to assign a taxi to a
booking, the status updates immediately.
