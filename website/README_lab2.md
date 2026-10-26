# Database Lab 2 - Login and To-Do List Application (original Lab 2 README, kept for reference; see ../README.md for Lab 3)

A full-stack web application implementing user authentication and personal to-do list management, built for the Database Systems Lab 2 assignment at Alexandria National University.

---

## Table of Contents

- [Team Members](#team-members)
- [Technology Stack](#technology-stack)
- [Project Overview](#project-overview)
- [How to Run](#how-to-run)
- [Features Implementation](#features-implementation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Lab Questions & Answers](#lab-questions--answers)
- [Project Structure](#project-structure)

---

## Team Members

- **Name:** Amr Khaled Anwar
- **Student ID:** 2304037
- **Contribution:** Worked on the overall implementation and integration of the project, including backend routes, authentication, database setup and SQL queries, frontend functionality, input validation, testing, and README documentation.

- **Name:** Yehia Helaly
- **Student ID:** 2304048
- **Contribution:** Collaborated on implementing and reviewing the application features, including authentication, to-do operations, frontend behavior, database integration, validation, and testing.

Both team members contributed to the project development and testing. The descriptions above summarize their main areas of contribution.

---

## Technology Stack

### Backend Technologies
- **Node.js (v14+)** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **express-session** - Session middleware for Express
- **bcryptjs** - Password hashing library (bcrypt implementation)
- **mysql2** - MySQL client with Promise support and prepared statements
- **dotenv** - Environment variable management

### Frontend Technologies
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with:
  - Flexbox layout system
  - CSS Grid for complex layouts
  - CSS Animations and transitions
  - Responsive media queries
  - Glassmorphism design effects
- **Vanilla JavaScript (ES6+)** - Client-side logic with:
  - Fetch API for AJAX requests
  - DOM manipulation
  - Form validation
  - Event handling

### Database
- **MySQL 8.0+** - Relational database management system
- **Plain SQL** - Direct SQL queries with prepared statements (no ORM)
- **Foreign Key Constraints** - Referential integrity enforcement

---

## Project Overview

This application demonstrates fundamental web development concepts combined with database integration:

**Core Functionality:**
- User registration and authentication system
- Session-based login/logout
- Private to-do list management
- CRUD operations for to-do items
- Real-time validation (client and server-side)

**Key Learning Objectives:**
- Understanding session management in web applications
- Implementing secure password storage with bcrypt
- Writing parameterized SQL queries to prevent injection
- Building responsive, accessible user interfaces
- Separating concerns between frontend and backend

---

## How to Run

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL Server** (MySQL 8.0 or compatible version) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** (for cloning) - [Download here](https://git-scm.com/)

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd db-lab2-todo-app
```

#### 2. Install Dependencies
```bash
npm install
```

This installs:
- express
- express-session
- bcryptjs
- mysql2
- dotenv

#### 3. Set Up the Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < database/schema.sql
```

**Important:** The current `database/schema.sql` starts by dropping and recreating the `registration` database. Running it again will delete existing data in that database. Use it for a fresh setup only, unless you have backed up any data you need.

**Option B: Using MySQL Client**
1. Open MySQL Workbench or your preferred MySQL client
2. Execute the contents of `database/schema.sql`
3. Verify tables were created:
   ```sql
   USE registration;
   SHOW TABLES;
   DESCRIBE users;
   DESCRIBE todos;
   ```

#### 4. Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `.env` with your actual credentials. The `.env.example` file must contain placeholder values only; never put your real database password in that example file, and do not commit `.env` to GitHub.
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=registration
SESSION_SECRET=generate-a-random-secret-string
PORT=3000
```

**Generate a secure SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 5. Start the Server

```bash
npm start
# or
node server.js
```

On Windows PowerShell, if the `npm` command is blocked by the script execution policy, try:
```powershell
npm.cmd start
```

You should see:
```
Server running on http://localhost:3000
```

#### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You will be redirected to the login page. Click "Register" to create your first account.

---

## Features Implementation (R1-R10)

### R1 - User Registration
**Implementation Location:** `server.js`, `public/register.html`, `public/register.js`

**Features:**
- Registration form with name, email, password, and confirm password fields
- Real-time client-side validation using JavaScript
- Server-side validation with exact error messages
- Duplicate email detection returning "Email Already Exists"
- Automatic session creation and login after successful registration
- Password hashing using bcrypt (cost factor 10)

**Validation Messages:**
- "Name is required"
- "Email is required"
- "Password is required"
- "Confirm password is required"
- "Passwords do not match"
- "Email Already Exists"

---

### R2 - User Login & Logout
**Implementation Location:** `server.js`, `public/login.html`, `public/login.js`

**Features:**
- Login form with email and password fields
- Unified error message for authentication failures
- Session-based authentication using express-session
- Secure logout that destroys the session
- Password verification using bcrypt.compare()

**Security Note:**
Both wrong email and wrong password return the same message "Invalid email or password" to prevent user enumeration attacks.

---

### R3 - Private To-Do Lists
**Implementation Location:** `server.js`

**Features:**
- Middleware-based authentication check (`requireAuth`)
- Automatic redirect to login for unauthenticated users
- Session-based user identification
- User isolation - each user sees only their own to-dos
- To-dos ordered by creation date (newest first)

**Security Implementation:**
```sql
SELECT todo_id, title, is_done, created_at
FROM todos
WHERE user_id = ?  -- From session, not form
ORDER BY todo_id DESC
```

---

### R4 - Add To-Do Items
**Implementation Location:** `server.js`, `public/list.js`

**Features:**
- Add new to-do items with a title field
- Client-side validation (required, max 200 characters)
- Server-side validation with exact error messages
- AJAX submission without page reload
- Automatic refresh of to-do list after addition

**Validation Messages:**
- "Title is required" for an empty or whitespace-only title
- "Title is too long" when the title exceeds 200 characters

---

### R5 - Edit To-Do Titles
**Implementation Location:** `server.js`, `public/list.js`

**Features:**
- Modal dialog for editing to-do titles
- Pre-populated with current title
- Same validation as add operation
- AJAX update without page reload
- Real-time list refresh after edit

---

### R6 - Toggle Completion Status
**Implementation Location:** `server.js`, `public/list.js`

**Features:**
- Checkbox to mark to-dos as done/not done
- Visual feedback with strikethrough and opacity
- Instant AJAX toggle without page reload
- Persistent state in database (is_done: 0/1)

---

### R7 - Delete To-Do Items
**Implementation Location:** `server.js`, `public/list.js`

**Features:**
- Delete button on each to-do item
- Confirmation modal dialog ("Are you sure?")
- Prevents accidental deletion
- AJAX deletion with immediate list update
- User isolation check in DELETE query

---

### R8 - Comprehensive Validation
**Implementation Location:** All forms in `register.js`, `login.js`, `list.js` and corresponding server routes

**Client-Side Validation:**
- JavaScript checks before form submission
- Real-time error clearing on input
- Prevents unnecessary server requests

**Server-Side Validation:**
- Server-side checks for required fields, password confirmation, duplicate email addresses, and title length
- Session-based error storage for registration and login forms, plus JSON error responses for to-do API requests
- Fallback validation for JavaScript-disabled browsers

**Error Messages:**
- **Register:** Name required, Email required, Password required, Confirm password required, Passwords do not match, Email Already Exists
- **Login:** Email required, Password required, Invalid email or password
- **Add/Edit:** Title required, Title too long (200 characters at most)

---

### R9 - Security Implementation
**Implementation Location:** Throughout `server.js`

**Security Features:**

1. **Password Hashing:**
   - bcrypt with cost factor 10
   - Salt automatically generated by bcrypt
   - One-way hashing (irreversible)

2. **SQL Injection Prevention:**
   - All queries use prepared statements with `?` placeholders
   - mysql2 library handles parameter binding
   - No string concatenation in queries

3. **Session Security:**
   - user_id always from session, never from form
   - Session secret for cookie signing
   - Session destruction on logout

4. **User Isolation:**
   - All queries include `AND user_id = ?`
   - Prevents cross-user data access
   - Referential integrity via foreign keys

---

### R10 - User Interface Design
**Implementation Location:** `public/styles.css`, all HTML files

**Design Features:**

**Consistent Styling:**
- Purple gradient theme across all pages
- Glassmorphism card effects
- Unified button styles with animations
- Consistent typography and spacing

**Responsive Design:**
- Mobile-first approach (360px minimum)
- Flexbox-based layouts
- Media queries for different screen sizes
- Touch-friendly button sizes

**User Feedback:**
- Clear error messages near form fields
- Visual state for completed to-dos (strikethrough, opacity)
- Friendly empty state message
- User name and logout button always visible
- Loading states for AJAX requests

**Animations:**
- Floating card animation
- Slide-in form fields
- Button hover effects with shine
- Modal fade-in/scale animations
- Smooth transitions throughout

**No Raw Errors:**
- All errors caught and handled gracefully
- User-friendly error messages
- No stack traces exposed to users
- Try-catch blocks on all async operations

---

## Database Schema

### Tables

**users table:**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**todos table:**
```sql
CREATE TABLE todos (
    todo_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    is_done TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Relationships
- **One-to-Many:** One user can have many to-dos
- **Foreign Key:** `todos.user_id` references `users.user_id`
- **Constraint:** Cannot insert a to-do for a non-existent user (referential integrity)

### Sample Data
```sql
-- Users
INSERT INTO users (name, email, password_hash) VALUES
('Sara', 'sara@mail.com', '$2b$12$...'),
('Omar', 'omar@mail.com', '$2b$12$...');

-- To-Dos
INSERT INTO todos (user_id, title, is_done) VALUES
(1, 'Buy oat milk', 1),
(1, 'Finish the lab', 0),
(2, 'Call mum', 0);
```

---

## API Documentation

### Authentication Endpoints

#### POST /register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:** Redirects to `/list` on success, or back to `/register` with errors

---

#### POST /login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Redirects to `/list` on success, or back to `/login` with errors

---

#### POST /logout
Destroy the user session.

**Response:** Redirects to `/login`

---

### To-Do Endpoints

#### GET /api/todos
Get all to-dos for the logged-in user.

**Response:**
```json
{
  "todos": [
    {
      "todo_id": 1,
      "title": "Buy groceries",
      "is_done": 0,
      "created_at": "2026-10-11T18:00:00.000Z"
    }
  ],
  "userName": "John Doe"
}
```

---

#### POST /api/todos
Create a new to-do item.

**Request Body:**
```json
{
  "title": "New to-do item"
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "errors": {
    "title": "Title is required"
  }
}
```

---

#### PUT /api/todos/:id
Update a to-do item's title.

**Request Body:**
```json
{
  "title": "Updated title"
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### PATCH /api/todos/:id/toggle
Toggle a to-do's completion status.

**Request Body:**
```json
{
  "is_done": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### DELETE /api/todos/:id
Delete a to-do item.

**Response:**
```json
{
  "success": true
}
```

---

### Utility Endpoints

#### GET /api/errors
Get current session errors (for displaying server-side validation messages).

**Response:**
```json
{
  "errors": {
    "email": "Email Already Exists"
  }
}
```

---

## Security Features

### Password Security
- **Algorithm:** bcrypt (cost factor 10)
- **Salting:** Automatic salt generation by bcrypt
- **Storage:** Only hashes stored, never plain passwords
- **Verification:** bcrypt.compare() for authentication

### SQL Injection Prevention
- **Method:** Prepared statements with parameterized queries
- **Library:** mysql2 with Promise support
- **Pattern:** All queries use `?` placeholders
- **Example:**
  ```javascript
  pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  ```

### Session Security
- **Middleware:** express-session
- **Storage:** Memory store (production should use Redis or similar)
- **Secret:** Configurable via SESSION_SECRET environment variable
- **User ID:** Always retrieved from session, never from form data

### Authorization
- **Middleware Functions:**
  - `requireAuth`: Protects routes requiring login
  - `requireGuest`: Redirects logged-in users from auth pages
- **User Isolation:** To-do queries use the authenticated user's ID from the session; UPDATE and DELETE operations include both the task ID and `user_id` in their conditions.
- **Cross-User Protection:** Task operations are restricted to the logged-in user's own tasks.

### CSRF Protection
- **Note:** Explicit CSRF tokens are not implemented in this coursework project.
- **Production Consideration:** Add CSRF protection and configure cookie security settings before deploying the application publicly. The current server configuration does not explicitly set the cookie `sameSite` option.

---

## Screenshots

Add the actual screenshots to the `screenshots/` folder before submission. The filenames below are suggested names; use the real filenames you save.

1. **Register page with error messages** - `screenshots/register-errors.png`
2. **Login page** - `screenshots/login.png`
3. **To-do list with items (one done)** - `screenshots/list-with-todos.png`
4. **Mobile view (phone-sized window)** - `screenshots/mobile-view.png`

---

## Lab Questions & Answers

### (a) Why do UPDATE and DELETE contain AND user_id = ?, and what changes if you remove it?

The `AND user_id = ?` clause ensures that a user can only modify or delete their own to-dos. This is a security measure because the `todo_id` comes from the browser (user input), which could be manipulated. Without this check, any user could modify or delete another user's to-dos by simply sending a different `todo_id` in the request. With the check, the statement affects zero rows when the to-do doesn't belong to the logged-in user, preventing unauthorized access.

### (b) What happens if you insert a to-do for a user_id that does not exist, and which constraint of the lecture is that?

If you try to insert a to-do with a `user_id` that doesn't exist in the `users` table, the database will reject the insertion due to the **foreign key constraint**. This is the referential integrity constraint from the lecture, which ensures that a foreign key value must either be null or match an existing primary key in the referenced table. The foreign key `FOREIGN KEY (user_id) REFERENCES users(user_id)` enforces this rule.

### (c) Why do you store a hash and not the password?

We store a hash instead of the plain password for security reasons. If the database is compromised, attackers would only get the hashed values, not the actual passwords. Hashing is a one-way function, so it's computationally infeasible to reverse the hash to obtain the original password. This protects users' passwords even if the database is breached. We use bcrypt which also includes a salt to prevent rainbow table attacks and slow down brute-force attempts.

**Key Points:**
- **One-way function:** Cannot reverse a hash to get the original password
- **Salt:** Each password gets a unique random salt, preventing rainbow table attacks
- **Cost factor:** bcrypt's work factor (10) makes brute-force attacks computationally expensive
- **Industry standard:** bcrypt is widely recommended for password storage
- **Defense in depth:** Even if the database is leaked, passwords remain protected

---

### (d) The name column is NOT NULL: why did you still need your own check for an empty name?

The `NOT NULL` constraint only prevents `NULL` values from being stored in the database. It does not prevent empty strings (`''`) or strings containing only whitespace. A user could submit a form with an empty name field, which would be stored as an empty string in the database (not NULL). Our own check ensures that the name field contains actual content, not just whitespace, providing a better user experience and data quality. This is an application-level validation that complements the database constraint.

**Database vs Application Validation:**

| Constraint Type | What It Prevents | What It Allows |
|----------------|------------------|----------------|
| `NOT NULL` | NULL values | Empty strings, whitespace |
| Application check | Empty strings, whitespace | Valid content |

**Why Both Are Needed:**
- Database constraints are the last line of defense
- Application validation provides better user experience
- Application validation can give specific error messages
- Database constraints ensure data integrity even if application logic fails

---

## Bonus Features

*(Optional - add if implemented)*

Currently no bonus features are implemented. Potential enhancements could include:
- Due dates for to-dos
- Filtering (all/open/done)
- Search functionality
- Dark mode toggle
- Counting open to-dos
- Deployment to cloud hosting
- Automated testing suite

---

## Project Structure

```
db-lab2-todo-app/
├── database/
│   └── schema.sql          # DDL script for users and todos tables
├── docs/
│   └── README.md           # Additional documentation
├── screenshots/            # Required screenshots for submission
├── public/
│   ├── register.html       # Registration page with form
│   ├── register.js         # Client-side validation for registration
│   ├── login.html          # Login page with form
│   ├── login.js            # Client-side validation for login
│   ├── list.html           # To-do list page with CRUD UI
│   ├── list.js             # To-do list functionality (AJAX)
│   └── styles.css          # Consistent styling with animations
├── .env.example            # Example environment variables (DO NOT commit .env)
├── .gitignore              # Git ignore rules (.env, node_modules, etc.)
├── package.json            # Node.js dependencies and scripts
├── server.js               # Express server with all routes and middleware
└── README.md               # This comprehensive documentation file
```

**File Descriptions:**

- **server.js** (318 lines): Main application server containing all routes, middleware, and database logic
- **database/schema.sql**: DDL script that creates the required tables; note that its current first statement drops and recreates the database, so rerunning it deletes existing data.
- **public/styles.css** (488 lines): Complete styling with animations, responsive design, and glassmorphism effects
- **public/list.js** (220 lines): To-do list CRUD operations with AJAX and modal handling
- **public/register.js** (82 lines): Registration form validation and error handling
- **public/login.js** (69 lines): Login form validation and error handling

---

**Last Updated:** October 12, 2026
**Version:** 1.0.0
