USE employees_db;
SELECT B.first_name AS manager,Group_CONCAT(A.first_name, " ", A.last_name, " - ",title) AS employees,name AS department,salary FROM employees A 
JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id
GROUP BY manager;