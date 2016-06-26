CREATE USER 'csh_map'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE csh_map;
GRANT ALL PRIVILEGES ON csh_map.* TO 'csh_map'@'localhost';
CREATE DATABASE csh_map_test;
GRANT ALL PRIVILEGES ON csh_map_test.* TO 'csh_map'@'localhost';
