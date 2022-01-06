INSERT INTO department (name)
VALUES ("Accounting");
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 150000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Williams", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lary", "Stevens", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Jackson", 1, null);