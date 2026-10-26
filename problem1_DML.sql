-- Lab 3 - Problem 1: COMPANY database (DML)
-- Run: mysql -u root -p < problem1_DML.sql
USE company;

-- 1) Employees first, with Dno still NULL (the departments do not exist yet)
INSERT INTO EMPLOYEE (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES
('111111111', 'Ahmed', 'Hassan', '1980-05-12', '12 Corniche St, Alexandria', 'M', 15000.00, NULL),
('222222222', 'Sara',  'Mostafa', '1985-09-23', '5 Smouha Ave, Alexandria',  'F', 12000.00, NULL),
('333333333', 'Omar',  'Khaled', '1990-01-30', '8 Sidi Gaber Rd, Alexandria', 'M',  8000.50, NULL),
('444444444', 'Mona',  'Adel',   '1992-11-05', '21 Stanley St, Alexandria',   'F',  9000.00, NULL);

-- 2) Departments (managers are existing employees)
INSERT INTO DEPARTMENT (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES
(1, 'Headquarters', '111111111', '2015-06-01'),
(2, 'Software',     '222222222', '2018-03-15'),
(3, 'Hardware',     '111111111', '2020-09-01');

-- 3) Now give every employee a department
UPDATE EMPLOYEE SET Dno = 1 WHERE ssn = '111111111';
UPDATE EMPLOYEE SET Dno = 2 WHERE ssn IN ('222222222', '333333333');
UPDATE EMPLOYEE SET Dno = 3 WHERE ssn = '444444444';

-- 4) Projects
INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dno) VALUES
(10, 'Payroll System',  'Alexandria', 1),
(20, 'Mobile App',      'Cairo',      2),
(30, 'Sensor Board',    'Alexandria', 3);
