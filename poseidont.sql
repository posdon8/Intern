CREATE DATABASE poseidont;	
USE poseidont;
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(255),
    category VARCHAR(50) NOT NULL
);
CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    note TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE OrderDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

create table Users (
 id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);



