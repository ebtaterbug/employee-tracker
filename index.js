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


function questions() {
inquirer
    .prompt([{
            name: 'action',
            type: 'list',
            message: 'Please select an option.',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
    }])
    .then(function (answers) {
        const selection = answers.action
        switch (selection) {
            case 'View All Departments':
                allDepartments()
                break;
            case 'View All Roles':
                allRoles()
                break;
            case 'View All Employees':
                allEmployees()
                break;
            case 'Add a Department':
                addDepartment()
                break;
            case 'Add a Role':
                addRole()
                break;
            case 'Add an Employee':
                addEmployee()
                break;
            case 'Update an Employee Role':
                updateEmployee()
                break;
            case 'Exit':
                db.end()
                break;
        }
            
    });
}


function allDepartments() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        questions()
    });
}

function allRoles() {
    const query = `SELECT * FROM role
                INNER JOIN department ON (department.id = role.department_id)`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
                questions()
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
                questions()
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
                console.log(`You have added ${answer.department}.`,
                questions()
                );
		});
	});
}

function addRole() {

	db.query(`SELECT * FROM department`, function (err, res) {
		if (err) throw err;
		const choices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt([{
                type: "input",
                name: "title",
                message: "Enter role title.",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter role Salary",
            },
            {
                type: "list",
                name: "departmentId",
                message: "Select the roles department",
                choices: choices,
            }])
			.then(function (answer) {
				var query = `INSERT INTO role SET ?`;
				db.query(
					query,
					{
						title: answer.title,
						salary: answer.salary,
						department_id: answer.departmentId,
					},
					function (err, res) {
						if (err) throw err;
                        console.log(`You have added ${answer.title}.`),
                        questions()
					}
                );
		});
	});
}

function addEmployee() {

	db.query(`SELECT * FROM department`, function (err, res) {
		if (err) throw err;
		const departments = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

        db.query(`SELECT id, title FROM role`, function (err, res) {
            if (err) throw err;
            const roles = res.map(({ id, title }) => ({
                value: id,
                name: `${id} ${title}`,
            }));

            db.query(`SELECT id, first_name, last_name FROM employee`, function (err, res) {
                if (err) throw err;
                const managers = res.map(({ id, first_name, last_name }) => ({
                    value: id,
                    name: `${id} ${first_name} ${last_name}`,
                }));

				inquirer
						.prompt(
							[
                                {
                                    name: "firstName",
                                    type: "input",
                                    message: "Enter employee's first name",
                                },
                                {
                                    name: "lastName",
                                    type: "input",
                                    message: "Enter employee's last name",
                                },
                                {
                                    name: "department",
                                    type: "list",
                                    message: "Select employee's department",
                                    choices: departments,
                                },
                                {
                                    name: "role",
                                    type: "list",
                                    message: "Select employee's role",
                                    choices: roles,
                                },
                                {
                                    name: "manager",
                                    type: "list",
                                    message: "Select employee's manager",
                                    choices: managers,
                                },
                            ],
						)
						.then((response) => {
							var role = parseInt(response.role);
							var manager = parseInt(response.manager);
							db.query(
								"INSERT INTO employee SET ?",
								{
									first_name: response.firstName,
									last_name: response.lastName,
									role_id: role,
									manager_id: manager,
								},
                                function (err, res) {
                                    if (err) throw err;
                                    questions()
                                }
							);
						});
				},
			);
        });
    });
};

function updateEmployee() {
    db.query(`SELECT id, first_name, last_name FROM employee`, function (err, res) {
        if (err) throw err;
        const employees = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${id} ${first_name} ${last_name}`,
        }));
        db.query(`SELECT id, title FROM role`, function (err, res) {
            if (err) throw err;
            const roles = res.map(({ id, title }) => ({
                value: id,
                name: `${id} ${title}`,
            }));

            inquirer.prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Select the employee to update",
                        choices: employees,
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Select employee's job position",
                        choices: roles,
                    },
                ]).then((response) => {
                let id = parseInt(response.employee);
                let role = parseInt(response.role);
                db.query(
                    `UPDATE employee SET role_id = ${role} WHERE id = ${id}`,
                    function (err, res) {
                        if (err) throw err;
                        console.log(`${response.employee} has been updated.`),
                        questions()
                    }
                );
            });
        });
    });
};

questions()