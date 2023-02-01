USE employees_db;
SELECT employees.id,first_name,last_name,manager_id,name,title,salary FROM employees
JOIN roles
ON role_id=roles.id
JOIN departments
ON department_id=departments.id;