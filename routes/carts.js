const express = require('express'); //requiring express
const cartsRepo = require('../repositories/carts'); //requiring Cartsrepo
const productsRepo =  require('../repositories/products'); // requiring productRepo
const cartShowTemplate = require('../views/carts/show'); //requiring html template for cart

//creating a router
const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
    // Figure out the cart!
    let cart;
    //checking if a user has a cart (req.session represent thee cookie)
    if (!req.session.cartId) {
    //if this condition return true.. we create the cart using create method and using items property as default empty array
        cart = await cartsRepo.create({ items: [] });
        //than we take the created cart with id and assing it with req.session.cartId
        req.session.cartId = cart.id;
    } else {
        //if condition return false we will user the getOne vre Repo te find the id of cart we trying to retrive
        cart = await cartsRepo.getOne(req.session.cartId);
    }

//checking if we have an existing item in the items property of cart using find method
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    //if we have existing item we just increase quantity by one
    if(existingItem){
        existingItem.quantity++;
    } else {
        //if no item exist in items property with the given id of product we push the id of product and we make quantity one by default
        cart.items.push({id: req.body.productId, quantity: 1});
    }
    // we take the cart and use method update from cartsRepo we assign card.id(to the specific record we want to update) and we save items we changed
    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    //after we add to cart a product we will be redirect to cart
    res.redirect('/cart');
});

// Receive a GET request to show all items in cart / when the user click add to cart button the item will be automatically added to cart and thw cart will be created
    router.get('/cart', async (req, res) => {
        //we make sure the user has a cart assigned  // so the user cant go to /cart page without having a cart created
       if(!req.session.cartId){
           //if not res.redirect will send us to localhost:3000
           return res.redirect('/');
       }
       //if the user has a cart assigned we will get the specific cart based on id.
       const cart = await cartsRepo.getOne(req.session.cartId);
        //we iterate through the list of item
       for(let item of cart.items){
           //than we loop through items array and we will throw the product which is added to cart
           const product = await productsRepo.getOne(item.id); // and we will get the item in product repository with the specific id and we will assign it in product variable

           //than we associate product with item.product property
           item.product = product;
       }
       //then we send back to user a html template with the items inside cart.items
       res.send(cartShowTemplate({items: cart.items }));


    });

    //Receiving  a post request to delete a product in the cart
    router.post('/cart/products/delete', async (req, res) => {
        const { itemId } = req.body; // we take id from the property itemId and assign it to itemId variable
        const cart = await cartsRepo.getOne(req.session.cartId); // we get the specific cart from carts repository

        const items = cart.items.filter(item => item.id !== itemId); // than we filter the items which id is not equal with the id of item we want to delete

        await cartsRepo.update(req.session.cartId, { items: items }); // than we update cart with the items which has been filtered

        res.redirect('/cart'); //than we redirect to cart page.
    });
// Receive a post request to delete an item from a cart

module.exports = router;
