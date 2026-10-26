-- Lab 3 - Problem 1: COMPANY database (DDL)
-- Run: mysql -u root -p < problem1_DDL.sql
DROP DATABASE IF EXISTS company;
CREATE DATABASE company;
USE company;

-- EMPLOYEE and DEPARTMENT point to each other (EMPLOYEE.Dno -> DEPARTMENT,
-- DEPARTMENT.mgr_ssn -> EMPLOYEE), so each table is created first
-- without the circular foreign key, and the keys are added with ALTER TABLE.

CREATE TABLE EMPLOYEE (
    ssn      CHAR(9)       NOT NULL,
    fname    VARCHAR(30)   NOT NULL,
    lname    VARCHAR(30)   NOT NULL,
    bdate    DATE,
    address  VARCHAR(100),
    gender   CHAR(1),
    salary   DECIMAL(10,2),
    Dno      INT,
    PRIMARY KEY (ssn)
);

CREATE TABLE DEPARTMENT (
    Dnumber        INT         NOT NULL,
    Dname          VARCHAR(50) NOT NULL,
    mgr_ssn        CHAR(9),
    mgr_start_date DATE,
    PRIMARY KEY (Dnumber)
);

CREATE TABLE PROJECT (
    Pnumber   INT         NOT NULL,
    Pname     VARCHAR(50) NOT NULL,
    Plocation VARCHAR(50),
    Dno       INT,
    PRIMARY KEY (Pnumber)
);

-- Foreign keys
ALTER TABLE EMPLOYEE
    ADD CONSTRAINT fk_employee_dept FOREIGN KEY (Dno)
    REFERENCES DEPARTMENT(Dnumber);

ALTER TABLE DEPARTMENT
    ADD CONSTRAINT fk_department_mgr FOREIGN KEY (mgr_ssn)
    REFERENCES EMPLOYEE(ssn);

ALTER TABLE PROJECT
    ADD CONSTRAINT fk_project_dept FOREIGN KEY (Dno)
    REFERENCES DEPARTMENT(Dnumber);
