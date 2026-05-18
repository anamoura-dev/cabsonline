Student Name: Ana Carolina Alves de Moura  
Student ID: 23201111  

========================================
FILE LIST
========================================

1. booking.html  
   User interface for customers to enter taxi booking details.

2. booking.js  
   Handles client-side validation and sends booking data to the server 
   asynchronously using the fetch API.

3. booking.php  
   Server-side script that processes booking requests, generates a unique 
   booking reference number (BRN), and stores booking data in the MySQL database.

4. admin.html  
   Admin interface for searching and managing taxi bookings.

5. admin.js  
   Handles client-side functionality for the admin page, including booking search 
   and taxi assignment actions.

6. admin.php  
   Server-side script that processes admin requests such as searching bookings 
   and assigning taxis.

7. style.css  
   Stylesheet used to design and format both booking and admin pages.

8. mysqlcommand.txt  
   Contains SQL commands to create the database and the bookings table.

9. readme.txt  
   This file, providing an overview of the system and instructions for use.

========================================
HOW TO RUN THE SYSTEM
========================================

Step 1: Database Setup
- Open MySQL or phpMyAdmin.
- Execute the SQL commands in "mysqlcommand.txt" to create the database and table.

Step 2: Upload Files
- Upload all project files to the server (e.g., webdev.aut.ac.nz) 
  inside the appropriate directory.

Step 3: Booking a Taxi
- Open "booking.html" in a web browser.
- Enter all required details:
  Name, Phone, Street Number, Street Name, Date, and Time.
- Click the "Book Taxi" button.
- A confirmation message will be displayed with:
  - Booking Reference Number (BRN)
  - Pickup Date
  - Pickup Time
(Dont forget to copy your reference number)

Step 4: Managing Bookings (Admin)
- Open "admin.html" in a web browser.

Search options:
- Enter a booking reference number (e.g., BRN00001) and click "Search Booking" 
  to retrieve a specific booking.

- Leave the search field empty and click "Search Booking" to display all 
  unassigned bookings within the next 2 hours.

Assigning taxis:
- Click the "Assign" button next to a booking.
- The booking status will update to "assigned".

========================================
NOTES
========================================

- All user inputs are validated before submission.
- Booking reference numbers are automatically generated.
- The system uses asynchronous communication (fetch API) for better performance.
- Booking data is stored in a MySQL database.

========================================
AI USAGE
========================================
I used ChatGPT/Claude as a support tool to clarify concepts and improve the clarity of my writing.
The tool was not used to generate final answers. All work submitted reflects my own understanding 
and has been critically reviewed and edited by me.