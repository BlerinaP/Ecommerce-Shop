const express = require('express'); //requiring express from package.json file
const productsRepo = require('../repositories/products'); //requiring productRepo from repository products
const productsIndexTemplate = require('../views/products/index'); //requiring html template for products

//Creatin a router
const router = express.Router();

//Receiving a get req to the routfile(localhost:3000) after req don;t throw any error we
//create a variable called product and we aaing all products from products.json file using getAll function from ProductRepo
router.get('/', async (req,res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products})); // than we send html template with the list of products
});
module.exports = router;