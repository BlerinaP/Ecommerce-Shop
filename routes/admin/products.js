    const express = require('express'); //requiring express from package.json
    const multer = require('multer');//requiring multer middleware for handeling multipart/form-data ehich is used to upload files


    const { handleErrors, requireAuth } = require('./middlewares'); //requiring functions from middlewares
    const productsRepo = require('../../repositories/products'); //requiring product repo
    const productsNewTemplate = require('../../views/admin/products/new'); //requiring html forms for new product
    const productsIndexTemplate = require('../../views/admin/products/index'); //requiring  html forms for products
    const productsEditTemplate = require('../../views/admin/products/edit'); //requiring html form to edit the products
    const { requireTitle, requirePrice } = require('./validators'); //requiring  validators


    const router = express.Router();//creating a new router
    const upload = multer({ storage: multer.memoryStorage() }); //

    //Receive a get req to the list of products we have created / defining path, requireAuth function
    router.get('/admin/products', requireAuth, async (req, res) => {
        const products = await productsRepo.getAll(); //after the request don;t throw any error we create a products variable // we call getAll func from productRepo // this function takes all data in product.json file
        res.send(productsIndexTemplate({ products })); // than we send html template with all products in the products.json file.
    });

    //Receiving a get request / defining path / requireAuth function ( to check is the user is sign in ) /
    router.get('/admin/products/new',  requireAuth, (req, res) => {
     res.send(productsNewTemplate({})); // than we send html template for adding new products
    });

    //Receive a post req/ defining path/ requireAuth ( to check is a user is sign in )
    router.post(
        '/admin/products/new',
        requireAuth,
        //after the requireauth the user can continue to upload images
        upload.single('image'), //uploading file(image)
        [requireTitle, requirePrice], // we use validators to check if a title and a price s provided
        handleErrors(productsNewTemplate), // we use handleErrors function to catch errors and show them into template
        async (req, res) => {
        const image = req.file.buffer.toString('base64'); // we get access to our file in req body  than we convert buffer data of file into string base64
        const { title, price } = req.body; // we get access to title and price from req.body
        await productsRepo.create({ title, price, image }); //we create the product with create function passing the attrs we want create


        res.redirect('/admin/products'); // after we create the product we wil be redirect to products list
    });

        //we Receive a get request to edit a product/ we define the path
    router.get('/admin/products/:id/edit', async(req, res) => {
        const product = await productsRepo.getOne(req.params.id); // we use getOne function which will filter only the product with the specific id we want to edit

        if(!product){ //if no product is found it will show this error
            return res.send('Product not found');
        }
        //if request doesn't show any error it will show as the edit template for the product with the specific id
        res.send(productsEditTemplate({ product }));
    });

    //than we Receive a post request
    router.post('/admin/products/:id/edit',
        requireAuth, // will check if a user is sing in
        upload.single('image'), // will look for the uploaded img
        [requireTitle, requirePrice], //checking if a title and a price is provided
        handleErrors(productsEditTemplate, async (req) => {
            const product = await productsRepo.getOne(req.params.id); // if any errors accrued *if a title or a price is not provided than we will use getOne function to get product with the specific id an return it as a callback function
            return { product };
        }),
        async (req, res) => {
        const changes = req.body; // we access req.body and assign data into variable changes

         // we check if a img is included into req
        if(req.file){
            changes.image = req.file.buffer.toString('base64'); //changes.image will be the new img we want to upload so will take buffer data and return them into a string base64
        }
        try{
        await productsRepo.update(req.params.id, changes) // we call the update function from productsRepo we provide the id of product we want to edit and the changes as arguments
        } catch { // if any errors is accrued will show this error
            return res.send('Could not find item');
        }
        //if no error is accrued we will redirect user to products
        res.redirect('/admin/products');
     }
    );

    //Receiving a post request to delete a product // we provide the path // we put requireAuth to check is a user is sign in
    router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
       await productsRepo.delete(req.params.id); // we call delete function from productsRepo which will filter all records that are not equal with the provided id
       res.redirect('/admin/products'); // and will be redirect into products page
    });

    module.exports = router;