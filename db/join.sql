USE employees_db;
SELECT A.first_name,A.last_name,title,name AS department,salary,B.first_name AS manager FROM employees A 
LEFT JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id