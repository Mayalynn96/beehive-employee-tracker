# Beehive - Employee Tracker 🐝
        
## Description 📄
        
![Type](https://img.shields.io/badge/Type-Sql_based_application-FFD25A.svg)
![License](https://img.shields.io/badge/License-MIT-FFAA5A.svg)

This application allows a user to create, edit and track their employees through a SQL database. The user has choices based on departments, roles and indevidual employees and their managers. Keeping track of just a handfull of employees might be easy enough to be kept through excel or other table based applications but when those numbers get higher this application helps manage them for you. I got to learn a lot about MySQL and connecting to Node.js and inquirer prompts.

## Table of Contents 📌
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Credit](#credit)
- [Test](#test)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation 📐
 
If the folder contains a package.json with dependencies listed and/or package-lock.json file, simply enter 'npm install' in the terminal.
If none of those files are available or there aren't any dependencies listed in the package.json make sure to follow these steps:

1. type 'npm init' into the terminal
2. type 'npm package-name@version' for each package listed below:


-console.table@0.10.0

-inquirer@8.2.4

-mysql2@3.1.0


Make sure you have mySql installed properly on your computer and start mysql -u root -password and enter your password when prompted. 
Then run `SOURCE ./db/schema.sql`.
Next, in index.js on line 8 set it to your own MySql password. 
        

## Usage 💻

Once all is installed correctly, simply open the terminal in the main folder and run node index.js. It will give the user a multitude of options they can choose from: 

    ? What would you like to do?
    > View all departments
      View all roles
      View all employees
      View all employees by manager
      View all employees by department
      Add a department
      Add a role
      Add an employee
      Update an employee role
      Update an employee manager
      Remove employee
      Remove role
      Remove department
      See total salaries by department
      See total salaries by role
      Quit
    (Move up and down to reveal more choices)

* When the user chooses any of the viewing options, they will be logged in the terminal.
* When the user chooses any of the add options, they will be able to add what was selected.
* When the user chooses any of the remove options, they will be able to select what to delete  depending on type selected.
* When the user chooses any of the see the total of all salaries options they will be shown which ever selected.
* When the user chooses to quit, it will end the prompt.
* When the user chooses any of the update employee options, they will be able to update any employees role or manager.

![Gif of application in action](/tracker.gif)

## License 🔑

This project is covered under the MIT license.

## Questions 📫

Find me on GitHub: https://github.com/Mayalynn96

Or email me at: Mayalynncohen@gmail.com