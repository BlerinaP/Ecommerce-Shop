const express = require('express'); //requiring express

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup'); //requiring signupTemplate(html form)
const signinTemplate = require('../../views/admin/auth/signin'); //requiring signinTemplate(html form)
const { requireEmail } = require('./validators');   // requiring validators for email
const { requirePassword } = require('./validators'); //requiring validators for pass
const { requirePasswordConfirmation } = require('./validators'); //requiring validators for passConf
const { requireExistingEmail } = require('./validators'); //requiring validators for email when we try to sign-in
const { requireValidPasswordForUser } = require('./validators'); //requiring validators for password when we try to sign-in
const { handleErrors } = require('./middlewares'); //requiring validators fto handle errors when we try to sign in or sign up

const router = express.Router(); //creating a router to handle requests

router.get('/signup', (req, res) => { // here we Receive a get request/ we tell the path and if request don't throw any error res will send us the template form with the request obj.
    res.send(signupTemplate({ req }));
});

router.post( // when we try to sign up we Receive a post request(post request are used to create a record // all the infos we provide in the form will be saved in request body not in url)
    '/signup', // we provide the path
    [requireEmail, requirePassword, requirePasswordConfirmation], // we use the validators we created to check  the email,pass and pass Conf
    handleErrors(signupTemplate), // Using middleware HandleError if we have any error, errors will be shown  in the template
    async (req, res) => {

        const { email, password, passwordConfirmation } = req.body; //after email,pass and passCOnf are checked and they don't throw any error we will try to find email or password inside the request
        const user = await usersRepo.create({ email, password }); // we use create method from the userRepo to create the user

        req.session.userId = user.id; // req.session is added by cookie session, is an obj, every info we throw inside will be maintained by cookie session, we store the user id inside the req.session

        res.redirect('/admin/products'); //after we sign up the user will be redirect to products page.
    }
);

router.get('/signout', (req, res) => { //Receive a get request with the path signout
    req.session = null; // we tell the browser to forget all the infos inside the cookie so we set it null.
    res.send('You are logged out'); // so here we send back a text just telling that u are sign out
});

router.get('/signin', (req, res) => { //Receiving a get request/ providing the path signin
    res.send(signinTemplate({})); // if the req don't show any error we will send the template form with res.send
});

router.post('/signin',[requireExistingEmail,requireValidPasswordForUser], // Receive a post request,  check email and pass
    handleErrors(signinTemplate), // if any error appear, with handleError function will show the errors
    async (req, res) => {

    const { email } = req.body; // we try to find inside the req object the email provided inside the form

    const user = await usersRepo.getOneBy({ email }); // So get the record with the provided email


    req.session.userId = user.id; // and we store the id of user into the req session

    res.redirect('/admin/products'); // than we redirect into products page
});

module.exports = router; // we can export router we created to another file.
