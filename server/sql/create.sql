alter user 'root'@'localhost' identified with mysql_native_password by 'wow123';
flush privileges;

-- Create the TomasMDB database
CREATE DATABASE IF NOT EXISTS TomasMDB;
USE TomasMDB;

-- Create the user table
CREATE TABLE IF NOT EXISTS startup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the ingredient table with quantity
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL, UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255)
);

-- Create the recipe table
CREATE TABLE IF NOT EXISTS favourites (
    id_user INT,
    id_startup INT,
    FOREIGN KEY (id_user) REFERENCES user(id),
    FOREIGN KEY (id_startup) REFERENCES startup(id)
);