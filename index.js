const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

const start = async () => {
    try {
        const options = await inquirer.prompt([
            {
                type: 'list',
                name: 'userChoice',
                message: 'What would you like to do?',
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
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
            case "Add a department":
                console.log("Add a department");
                break;
            case "Add a role":
                console.log("Add a role");
                break;
            case "Add an employee":
                console.log("Add an employee");
                break;
            case "Update an employee role":
                console.log("Update an employee role");
                break;
            case "Quit":
                return console.log('Goodbye!');
                break;
        }
    } catch (err) {
        console.log(err);
    }
}

start()

const viewAllDep = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res)
            start()
        }
    })
}

const viewAllRols = () => {
    db.query('SELECT roles.id,title,name AS department,salary FROM roles JOIN departments on department_id=departments.id', (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            start();
        }
    })
}

const viewAllEmp = () => {
    db.query(`
SELECT A.id,A.first_name,A.last_name,title,name AS department,salary,CONCAT (B.first_name, " ", B.last_name) AS manager FROM employees A
LEFT JOIN employees B
ON A.manager_id=B.id
JOIN roles
ON A.role_id=roles.id
JOIN departments
ON department_id=departments.id`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            start();
        }
    })
}

