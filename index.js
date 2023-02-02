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
                addDep();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
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

const addDep = async () => {
    const userInput = await inquirer.prompt([
      {
         type: 'input', 
         name: 'depName',
         message: 'What is the name of the department?'
      }
    ])
    db.query('INSERT INTO departments(name) VALUES (?)', [userInput.depName], (err,res)=>{
        if(err){
            console.log(err);
        } else {
            console.log(userInput.depName + ' has been added to the departments database!');
            start();
        }
    })
}

const addRole = () => {
        db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
        } else {
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
                 choices: res
              }
              ]).then((userInput)=>{ 
                console.log(userInput);
                let depId = '';
                res.forEach((dep)=>{
                    if(dep.name===userInput.department){
                        depId = dep.id
                    }
                })
                db.query('INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)', [userInput.roleName, userInput.salary, depId], (err,res)=>{
                    if(err){
                        console.log(err);
                    } else {
                        console.log(userInput.roleName + ' has been added to the departments database!');
                        start();
                    }
                })
              }) 
        }
    })
}

const addEmployee = () => {
    let employeeData = '';
    let managerList = [];
    db.query('SELECT * FROM employees', (err, res)=>{
        if(err){
            console.log(err);
        } else {
            employeeData = res;
            managerList.push('none')
            res.forEach((employee)=>{
                const fullName = employee.first_name + ' ' + employee.last_name
                managerList.push(fullName)
            })
        }
    })
    db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const allRoles = [];
            res.forEach((role)=>{
                allRoles.push(role.title)
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
                 choices: allRoles
              },
              {
                type: 'list', 
                name: 'manager',
                message: 'Who is their manager',
                choices: managerList
             }
              ]).then((userInput)=>{ 
                let roleId = '';
                res.forEach((role)=>{
                    if(role.title===userInput.role){
                        roleId = role.id
                    }
                })
                let managerId = '';
                if(userInput.manager==='none'){
                    managerId = null;
                } else {
                    employeeData.forEach((employee)=>{
                        const fullName = employee.first_name + ' ' + employee.last_name
                        if(fullName===userInput.manager){
                            managerId = employee.id
                        }
                    })
                }
                db.query('INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [userInput.firstName, userInput.lastName, roleId, managerId], (err,res)=>{
                    if(err){
                        console.log(err);
                    } else {
                        console.log(userInput.firstName + ' ' + userInput.lastName + ' has been added!');
                        start();
                    }
                })
              }) 
        }
    })
}
