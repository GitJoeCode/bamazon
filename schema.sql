DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Savannah", "singles", "150", "3");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BFZ booster", "sealed_product", "6", "40");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Year of the Rat", "secret_lair", "65", "10");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Uri EDH deck", "edh_decks", "1000", "1");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Commander Anthology", "edh_decks", "300", "2");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Library of Alexandria", "singles", "1000", "1");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("War of the Spark booster", "sealed_product", "216", "3");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Eldraine Wonderland", "secret_lair", "60", "10");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1000 rares", "bulk", "200", "2");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("5000 cards", "bulk", "30", "5");