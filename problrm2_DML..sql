-- Lab 3 - Problem 2: Library database (seed data)
-- Run: mysql -u root -p < problem2_DML.sql
USE library;

INSERT INTO AUTHOR (author_id, name, country) VALUES
(1, 'Naguib Mahfouz',   'Egypt'),
(2, 'Agatha Christie',  'United Kingdom'),
(3, 'Gabriel Garcia Marquez', 'Colombia'),
(4, 'Paulo Coelho',     'Brazil');

INSERT INTO BOOK (book_id, title, price, author_id) VALUES
(1, 'Palace Walk',                   14.50, 1),
(2, 'Midaq Alley',                   11.00, 1),
(3, 'Murder on the Orient Express',  12.99, 2),
(4, 'And Then There Were None',      13.50, 2),
(5, 'One Hundred Years of Solitude', 18.75, 3),
(6, 'Love in the Time of Cholera',   16.20, 3),
(7, 'The Alchemist',                 15.00, 4);
