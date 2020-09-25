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
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    loadProducts();
});
  
// Function to load the products table from the database and print results to the console
function loadProducts() {
    // Selects all of the data from the MySQL products table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        // Draw the table in the terminal using the response
        console.table(res);

        // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
        promptCustomerForItem(res);
    });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
// Prompts user for what they would like to purchase
inquirer
    .prompt([
    {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: function(val) {
        return !isNaN(val) || val.toLowerCase() === "q";
        }
    }
    ])
    .then(function(val) {
    // Check if the user wants to quit the program
    checkIfShouldExit(val.choice);
    var choiceId = parseInt(val.choice);
    var product = checkInventory(choiceId, inventory);

    // If there is a product with the id the user chose, prompt the customer for a desired quantity
    if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptCustomerForQuantity(product);
    }
    else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.");
        loadProducts();
    }
    });
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
inquirer
    .prompt([
    {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
        return val > 0 || val.toLowerCase() === "q";
        }
    }
    ])
    .then(function(val) {
    // Check if the user wants to quit the program
    checkIfShouldExit(val.quantity);
    var quantity = parseInt(val.quantity);

    // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
    if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
    }
    else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
    }
    });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        loadProducts();
        }
    );
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
        // If a matching product is found, return the product
        return inventory[i];
        }
    }
    // Otherwise return null
    return null;
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        // Log a message and exit the current node process
        console.log("Goodbye!");
        process.exit(0);
    }
}
  

// var stockQuantity;
// var newStockQuantity;
// var customerTotal;
// var selectedItem;
// var cost;
// var totalSales;
    
// connection.connect (function(err) {
//     if (err) throw err;
//     displayProduct();
// });

// function displayProduct() {
//     connection.query("SELECT * FROM products", function(err,res) {
//         if (err) {
//             throw err;
//         };
//         console.table(res);
//         custBuy();
//     });
// };

// var custBuy = function() {
    
//     connection.query("SELECT * FROM products", function(err, results) {
//         if (err) throw err;

//         inquirer.prompt(
//             [
//                 {
//                     type: "rawlist",
//                     name: "choice",
//                     message: "Enter the ID of product you want to purchase",
//                     choices: function creatProductArray() {
//                         var productArray = [];
//                         for (var i = 0; i < results.length; i++) {
//                             productArray.push(results[i].product_name);
//                         }
//                         return productArray;
//                     }
//                 },
//                 {
//                     type: "input",
//                     name: "quantity",
//                     message: "How many units desired?"
//                 }
//             ]
//         ).then(function(val) {
//             checkStock(val, results);
//         });
//     });
// };


// function checkStock(answer, results) {
    
//     for (var i = 0; i < results.length; i++) {
//         if (results[i].product_name === answer.choice) {
//             selectedItem = results[i];
//             stockQuantity = selectedItem.stock_quantity;
//             requestedQuantity = answer.quantity;
//             cost = selectedItem.price;
//             salesToDate = selectedItem.product_sales;
//         };
//     };
//     if (stockQuantity >= parseInt(requestedQuantity)) {
//         changeStock();
//         calculateTotal();
//         connection.query (
//             "UPDATE products SET ? WHERE ?",
//             [
//                 {
//                     stock_quantity: newStockQuantity
//                 },
//                 {
//                     id: selectedItem.id
//                 }
//             ],
//             function(error) {
//                 if (error) {
//                     throw error;
//                 } else{
//                     console.log("\n\n");
//                     console.log("Your total is " + customerTotal);
//                     console.log("-----------------------------\n\n\n\n");
                    
//                 }
//             }
//         );
//         calculateProductSales();
//         connection.query (
//             "UPDATE products SET ? WHERE ?",
//             [
//                 {
//                     product_sales: totalSales
//                 },
//                 {
//                     id: selectedItem.id
//                 }
//             ],
//             function(error) {
//                 if (error) {
//                     throw error;
//                 } else{
//                     loadProducts();
//                 }
//             }
//         )
//     } else {
//         console.log("Insufficient quantity!");
//         loadProducts();
//     };
// };

// function changeStock() {
//     newStockQuantity = stockQuantity - requestedQuantity;
// };

// function calculateTotal() {
//     customerTotal = cost * requestedQuantity;
// };

// function calculateProductSales() {
//     totalSales = salesToDate + customerTotal;
// };
