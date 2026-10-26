# Lab 3 - Foreign Keys and Simple SQL

Introduction to Database Systems, Alexandria National University (Fall 2026)

- Student: Amr Khaled Anwar Ahmed Hassan
- Student ID: 2304037 (Group 2)
- Student: Yehia Helaly
- Student ID: 2304048 (Group 2)




## Folder content

```
lab3-2304037/
  problem1_DDL.sql       # COMPANY database: tables, primary keys, foreign keys
  problem1_DML.sql       # INSERT rows (4 employees, 3 departments, 3 projects)
  problem1_Answers.txt   # SQL + output/error for Q1.1 - Q1.3
  problem2_DDL.sql       # library database: AUTHOR and BOOK (ON DELETE CASCADE)
  problem2_DML.sql       # seed data: 4 authors, 7 books
  website/               # Lab 2 website (login + to-do list) with the new Library pages
  README.md              # this file
```

## Prerequisites

- MySQL Server 8.0+ and the `mysql` client
- Node.js 14+ and npm

## Part I - Problem 1 (COMPANY database)

Run from this folder:

```bash
mysql -u root -p < problem1_DDL.sql     # creates database "company" and its tables
mysql -u root -p < problem1_DML.sql     # inserts the rows
mysql -u root -p company                # type queries by hand
```

`problem1_Answers.txt` has the SQL and the output/error for Q1.1, Q1.2 and Q1.3.
The DDL script starts with `DROP DATABASE IF EXISTS company;`, so it can be re-run at any time.

## Part II - Problem 2 (Library website)

### 1. Create the databases

```bash
# from the lab3-2304037 folder
mysql -u root -p < problem2_DDL.sql          # database "library": AUTHOR and BOOK
mysql -u root -p < problem2_DML.sql          # seed data (4 authors, 7 books)

# the Lab 2 database for login/registration (needed to log in to the website)
mysql -u root -p < website/database/schema.sql
```

### 2. Configure the website

```bash
cd website
npm install
cp .env.example .env        # Windows: copy .env.example .env
```

Open `.env` and set `DB_PASSWORD` to your MySQL root password. Keep `DB_NAME=registration`
and `LIBRARY_DB_NAME=library`. Optionally set `SESSION_SECRET` to any long random text.

### 3. Start the server

```bash
npm start
```

(On Windows PowerShell, if `npm` is blocked, use `npm.cmd start`.)
You should see `Server running on http://localhost:3000`.

### 4. Use the website

1. Open http://localhost:3000, click **Register**, and create an account (then log in).
2. Click **Library** (top right of the to-do page), or go to http://localhost:3000/library.

| Requirement | Where on the page |
|---|---|
| F2.1 Show the books table (with `author_id`) and the authors table | Two tables, **Books** and **Authors** |
| F2.2 Add a book / add an author | **Add book** and **Add author** buttons |
| F2.3 Edit a book / edit an author | **Edit** button on each row |
| F2.4 Remove a book | **Delete** button on a book row (confirmation) |
| F2.5 Remove an author | **Delete** button on an author row (confirmation; its books are deleted too) |
| Bonus: images | A cover on each book and a photo on each author: choose a file in the add/edit form |

Notes:
- The library pages are part of the Lab 2 website, so you must be logged in to use them.
- The book form chooses the author from a list, so `BOOK.author_id` always points to a real author.
- Deleting an author removes its books in the database (`ON DELETE CASCADE` in `problem2_DDL.sql`).
- Images (JPG, PNG, GIF or WEBP, up to 5 MB) are saved in `website/uploads/`. No schema change is needed.
- To restore the seed data at any time, run `problem2_DDL.sql` and `problem2_DML.sql` again.

### Website files added for Lab 3

- `website/routes/library.js` - API for authors and books (plain `SELECT`, `INSERT`, `UPDATE`, `DELETE`, no JOIN; prepared statements)
- `website/public/library.html`, `website/public/library.js` - the Library page
- `website/public/styles.css` - extra styles at the end of the file
- `website/server.js` - two lines added to load the library routes

The original Lab 2 README is kept in `website/README_lab2.md`.
