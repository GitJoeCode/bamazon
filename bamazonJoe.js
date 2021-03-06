var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SQL4practice",
    database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect (function(err) {
    if (err) {
            console.error("error connecting: " + err.stack);
    }
    displayProduct();
});

var stockQuantity;
var newStockQuantity;
var customerTotal;
var selectedItem;
var cost;
var totalSales;

function displayProduct() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) {
            throw err;
        };
        console.table(res);
        custBuy();
    });
};

var custBuy = function() {
    
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer.prompt(
            [
                {
                    type: "rawlist",
                    name: "choice",
                    message: "Enter the ID of product you want to purchase",
                    choices: function creatProductArray() {
                        var productArray = [];
                        for (var i = 0; i < results.length; i++) {
                            productArray.push(results[i].product_name);
                        }
                        return productArray;
                    }
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many units desired?"
                }
            ]
        ).then(function(val) {
            checkStock(val, results);
        });
    });
};


function checkStock(answer, results) {
    
    for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === answer.choice) {
            selectedItem = results[i];
            stockQuantity = selectedItem.stock_quantity;
            requestedQuantity = answer.quantity;
            cost = selectedItem.price;
            salesToDate = selectedItem.product_sales;
        };
    };
    if (stockQuantity >= parseInt(requestedQuantity)) {
        changeStock();
        calculateTotal();
        connection.query (
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStockQuantity
                },
                {
                    id: selectedItem.id
                }
            ],
            function(error) {
                if (error) {
                    throw error;
                } else{
                    console.log("\n\n");
                    console.log("Your total is " + customerTotal);
                    console.log("-----------------------------\n\n\n\n");
                    
                }
            }
        );
        calculateProductSales();
        connection.query (
            "UPDATE products SET ? WHERE ?",
            [
                {
                    product_sales: totalSales
                },
                {
                    id: selectedItem.id
                }
            ],
            function(error) {
                if (error) {
                    throw error;
                } else{
                    loadProducts();
                }
            }
        )
    } else {
        console.log("Insufficient quantity!");
        loadProducts();
    };
};

function changeStock() {
    newStockQuantity = stockQuantity - requestedQuantity;
};

function calculateTotal() {
    customerTotal = cost * requestedQuantity;
};

function calculateProductSales() {
    totalSales = salesToDate + customerTotal;
};