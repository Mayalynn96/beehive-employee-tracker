DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    Foreign Key (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    Foreign Key (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    manager_id INT DEFAULT NULL,
    Foreign Key (manager_id) REFERENCES employees(id) ON DELETE SET NULL
)