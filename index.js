const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',

        user: process.env.DB_USER,

        password: process.env.DB_PW,
        
        database: process.env.DB_NAME
      },
      console.log('Connected to database.')
);

//inquirer
    //.prompt({
            //name: 'action',
            //type: 'list',
            //message: 'Please select an option.',
            //choices: [
                //'View All Departments',
                //'View All Roles',
                //'View All Employees',
                //'Add a Department',
                //'Add a Role',
                //'Add an Employee',
                //'Update an Employee Role',
                //'Exit'
           // ]
   // })
    //.then(answer => {
       // if (answer.action === 'View All Departments') {
        //    allDepartments()
       // }
   // });


function allDepartments() {
    const query = `SELECT * FROM department`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
            });
}

function allRoles() {
    const query = `SELECT role.title, role.id, role.salary, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
            });
}

function allEmployees() {
    const query =  `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
            });
}

function getRoles() {
    const query = `SELECT * FROM department;`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.log(res.name);
            });
}

async function addDepartment() {
	await inquirer.prompt({
		name: "department",
		type: "input",
		message: "What do you want to name your new department?",
	    }).then(function (answer) {
            var query = `INSERT INTO department (name) 
                        VALUES ( ? )`;
                db.query(query, answer.department, function (err, res) {
                if (err) throw err;
                console.log(`You have added this department: ${answer.department.toUpperCase()}.`,
                );
		});
	});
    await allDepartments()
}

addDepartment()