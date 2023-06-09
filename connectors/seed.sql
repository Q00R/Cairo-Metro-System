-- Insert Roles
INSERT INTO se_project.roles("role")
	VALUES ('user');
INSERT INTO se_project.roles("role")
	VALUES ('admin');
INSERT INTO se_project.roles("role")
	VALUES ('senior');	

INSERT INTO se_project.zones values(1, '1-9', 5);
INSERT INTO se_project.zones values(2, '10-15', 7);
INSERT INTO se_project.zones values(3, '16+', 10);

-- Set user role as Admin
UPDATE se_project.users
	SET "roleId"=2
	WHERE "email"='desoukya@gmail.com';