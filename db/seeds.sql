USE employees_db;
INSERT INTO departments(name)
VALUES
("Production"),
("Maintenance"),
("Sales");
INSERT INTO roles(title,salary,department_id)
VALUES
("Production manager",70000,1),
("Honey maker",50000,1),
("Quality Control",85000,1),
("Janitor",45000,2),
("Sales manager",70000,3),
("Cashier",45000,3),
("Customer Service",50000,3);
INSERT INTO employees(first_name,last_name,role_id,manager_id)
VALUES
("Beetrice","Honeydew",1,NULL),
("Albeert", "Combs",2,1),
("Lance", "Abeet",2,1),
("Smoky", "Bee",2,1),
("Jane", "Itor",4,NULL),
("Molly", "Sweets",5,NULL),
("Denis", "Sined",6,4),
("Aurora", "Borealis",6,4),
("Vince", "Black",5,NULL),
("Lucy", "Red",7,8);