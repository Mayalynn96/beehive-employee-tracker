const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Connecting database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

// Starting function
const start = async () => {
    try {
        // Start selection prompt
        const options = await inquirer.prompt([
            {
                type: 'list',
                name: 'userChoice',
                message: 'What would you like to do?',
                choices: ["View all departments", "Add a department", "Remove department", "View all roles", "Add a role", "Remove role", "View all employees", "View employees by manager", "View employees by department", "Add an employee", "Update an employee role", "Update an employee manager", "Remove employee", "See total salaries by department", "See total salaries by role", "Quit"]
            }
        ])
        switch (options.userChoice) {
            case "View all departments":
                viewAllDep();
                break;
            case "View all roles":
                viewAllRols();
                break;
            case "View all employees":
                viewAllEmp();
                break;
            case "View employees by manager":
                viewByManager();
                break;
            case "View employees by department":
                viewByDep();
                break;
            case "Add a department":
                addDep();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Update an employee manager":
                updateEmployeeManager();
                break;
            case "Remove employee":
                deleteEmployee();
                break;
            case "Remove role":
                deleteRole();
                break;
            case "Remove department":
                deleteDepartment();
                break;
            case "See total salaries by department":
                getTotalByDepartment();
                break;
            case "See total salaries by role":
                getTotalByRole();
                break;
            case "Quit":
                console.log('Goodbye!');
                return process.exit(1);
        }
    } catch (err) {
        console.log(err);
    }
}

// Welcome text
console.log(`      
--------------------------------------
                                   
  ???? Beehive - Employee Tracker ???? 
                                     
--------------------------------------
        `);

start()

// View all departments function
const viewAllDep = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n')
            start()
        }
    })
}

// view all roles function
const viewAllRols = () => {
    db.query('SELECT roles.id,title,name AS department,salary FROM roles JOIN departments on department_id=departments.id', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res,'\n');
            start();
        }
    })
}

// view all employees function
const viewAllEmp = () => {
    db.query(`
SELECT A.id,A.first_name,A.last_name,title,salary,name AS department,CONCAT (B.first_name, " ", B.last_name) AS manager FROM employees A
LEFT JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id
ORDER BY department,salary DESC`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n');
            start();
        }
    })
}

// view employees by manager function
const viewByManager = () => {
    db.query(`
    SELECT CONCAT(B.first_name, " ", B.last_name) AS manager,name AS department,Group_CONCAT(A.first_name, " ", A.last_name, " - ",title) AS employees FROM employees A 
    JOIN employees B
    ON A.manager_id=B.id
    JOIN roles
    ON A.role_id=roles.id
    JOIN departments
    ON department_id=departments.id
    GROUP BY manager`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n');
            start();
        }
    })
}

// view employees by department function
const viewByDep = () => {
    db.query(`
    SELECT name AS department,Group_CONCAT(first_name, " ",last_name, " - ",title) AS employees FROM employees
    JOIN roles
    ON role_id=roles.id
    JOIN departments
    ON department_id=departments.id
    GROUP BY department`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n');
            start();
        }
    })
}

// add department function
const addDep = async () => {
    const userInput = await inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the department?'
        }
    ])
    db.query('INSERT INTO departments(name) VALUES (?)', [userInput.depName], (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('\n' + userInput.depName + ' has been added to the departments database!' + '\n');
            start();
        }
    })
}

// add role function
const addRole = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const departmentData = [];
            res.forEach(department => {
                departmentData.push({
                    name: department.name,
                    value: {
                        name: department.name,
                        id: department.id
                    }
                })
            })
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department does this role belong to?',
                    choices: departmentData
                }
            ]).then((userInput) => {
                db.query('INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)', [userInput.roleName, userInput.salary, userInput.department.id], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('\n' + userInput.roleName + ' has been added to the ' + userInput.department.name + ' department!' + '\n');
                        start();
                    }
                })
            })
        }
    })
}

// add employee function
const addEmployee = () => {
    let employeeData = [];
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            employeeData.push({
                name: 'None',
                value: {
                    name: 'None',
                    id: null
                }
            })
            res.forEach((employee) => {
                employeeData.push({
                    name: employee.first_name + ' ' + employee.last_name,
                    value: {
                        name: employee.first_name + ' ' + employee.last_name,
                        id: employee.id
                    }
                })
            })
            db.query(`SELECT * FROM roles`, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    const rolesData = [];
                    res.forEach((role) => {
                        rolesData.push({
                            name: role.title,
                            value: {
                                name: role.title,
                                id: role.id
                            }
                        })
                    })
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'What is their first name?'
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'What is their last name?'
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is their role?',
                            choices: rolesData
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is their manager',
                            choices: employeeData
                        }
                    ]).then((userInput) => {
                        db.query('INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [userInput.firstName, userInput.lastName, userInput.role.id, userInput.manager.id], (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('\n' + userInput.firstName + ' ' + userInput.lastName + ' has been added!' + '\n');
                                start();
                            }
                        })
                    })
                }
            })
        }
    })
}

// update employee role function
const updateEmployeeRole = () => {
    const employeeData = [];
    const rolesData = [];
    db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            res.forEach((role) => {
                rolesData.push({
                    name: role.title,
                    value: {
                        name: role.title,
                        id: role.id
                    }
                })
            })
            db.query('SELECT * FROM employees', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    res.forEach((employee) => {
                        employeeData.push({
                            name: employee.first_name + ' ' + employee.last_name,
                            value: {
                                name: employee.first_name + ' ' + employee.last_name,
                                id: employee.id
                            }
                        })
                    })
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: "Which employee's role do you want to update",
                            choices: employeeData
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Which role do you want to assign the selected employee?',
                            choices: rolesData
                        }
                    ]).then((userInput) => {
                        db.query('UPDATE employees SET role_id=? WHERE id=?', [userInput.role.id, userInput.employee.id], (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('\n' + userInput.employee.name + "'s role has been updated to " + userInput.role.name + '\n');
                                start();
                            }
                        })
                    })
                }
            })
        }
    })

}

// update employee manager function
const updateEmployeeManager = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const employeeData = [];
            res.forEach(employee => {
                employeeData.push({
                    name: employee.first_name + " " + employee.last_name,
                    value: {
                        name: employee.first_name + " " + employee.last_name,
                        id: employee.id
                    }
                })
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's manager do you want to update",
                    choices: employeeData
                },
            ]).then(userInputA => {
                const managerData = [];
                managerData.push({
                    name: 'none',
                    value: {
                        name: 'none',
                        id: null
                    }
                })
                employeeData.forEach(employee => {
                    if (employee.name != userInputA.employee.name) {
                        managerData.push(employee)
                    }
                })
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: managerData
                    }
                ]).then((userInputB) => {
                    db.query('UPDATE employees SET manager_id=? WHERE id=?', [userInputB.manager.id, userInputA.employee.id], (err, res) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('\n' + userInputA.employee.name + "'s manager has been updated to " + userInputB.manager.name + '\n');
                            start();
                        }
                    })
                })
            })
        }
    })
}

// delete employee function
const deleteEmployee = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const employeeData = [];
            res.forEach(employee => {
                employeeData.push({
                    name: employee.first_name + " " + employee.last_name,
                    value: {
                        name: employee.first_name + " " + employee.last_name,
                        id: employee.id
                    }
                })
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to delete?',
                    choices: employeeData
                }
            ]).then(userInput => {
                db.query('DELETE FROM employees WHERE id=?', [userInput.employee.id], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('\n' + userInput.employee.name + ' has been removed!' + '\n');
                        start()
                    }
                })
            })
        }
    })
}

// delete role function
const deleteRole = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const roleData = [];
            res.forEach(role => {
                roleData.push({
                    name: role.title,
                    value: {
                        name: role.title,
                        id: role.id
                    }
                })
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role would you like to delete?',
                    choices: roleData
                }
            ]).then(userInput => {
                db.query('DELETE FROM roles WHERE id=?', [userInput.role.id], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('\n' + userInput.role.name + ' has been removed from all roles!' + '\n');
                        start()
                    }
                })
            })
        }
    })
}

// delete departement function
const deleteDepartment = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const departmentData = [];
            res.forEach(department => {
                departmentData.push({
                    name: department.name,
                    value: {
                        name: department.name,
                        id: department.id
                    }
                })
            })
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department would you like to delete?',
                    choices: departmentData
                }
            ]).then(userInput => {
                db.query('DELETE FROM departments WHERE id=?', [userInput.department.id], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('\n' + userInput.department.name + ' has been removed from all departments!' + '\n');
                        start()
                    }
                })
            })
        }
    })
}

// get total of all saleries by department function
const getTotalByDepartment = () => {
    db.query(`
SELECT name AS department,SUM(salary) AS total FROM employees A
LEFT JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id
GROUP BY department`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n');
            start();
        }
    })
}

// get total of all saleries by role function
const getTotalByRole = () => {
    db.query(`
SELECT name AS department,title AS role,SUM(salary) AS total FROM employees A
LEFT JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id
GROUP BY role`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table('\n', res, '\n');
            start();
        }
    })
}