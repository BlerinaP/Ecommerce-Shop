const { check } = require('express-validator'); //requiring express-validator package
const usersRepo = require('../../repositories/users'); //requiring userRepo


module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5 and 40 characters'),

    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage('Must be a number greater than 1'),

    requireEmail: check('email') //checking email
        .trim() //use this function so if it has any space to ignore it
        .normalizeEmail() // normalize email
        .isEmail() // check if the string is  email
        .withMessage('Must be a valid email') // showing this message if email input is blank
        .custom(async email => { //creatin a custom validator to check if any user has been sign up with this email using getOneby function from usersRepo
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) { // if any user has been sign up with this email will throw an error
                throw new Error('Email in use');
            }
        }),

    requirePassword: check('password') //checking the password
        .trim() //removing spaces
        .isLength({ min: 4, max: 20 }) // checking if the length is between 4 and 20
        .withMessage('Must be between 4 and 20 characters'), // if the password inputis blank

    requirePasswordConfirmation: check('passwordConfirmation') //checking pass confirmation
        .trim()//ignoring spaces
        .isLength({ min: 4, max: 20 })//checking if length is between 4 and 20
        .withMessage('Must be between 4 and 20 characters')// if password inputConf is blank
        .custom((passwordConfirmation, { req }) => { //creating a custom validator to check is passConf is equal with the password
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match');//if not will throw this errs
            } else { // is is true will continue return true
                return true;
            }
        }),

    requireExistingEmail:   check('email') //checking if email exist in data-store file
        .trim() //ignorin spaces
        .normalizeEmail() //normalize email
        .isEmail()//check to see if string is email
        .withMessage('Must provide a valid email') // if the email input is blank will show this error
        .custom(async (email) => { //creating a custom validator to see in the data store file if this email exist
            const user = await usersRepo.getOneBy({ email }); // thi the function getOneBy whixh is created in User repo will filter for the email
            if (!user) { // if no email was found in the records in data store file
                throw new Error('Email not found'); // will throw this error.
            }
        }),
    requireValidPasswordForUser: check('password') // checking if the password is the same as the password we provided when we created the user
        .trim() //ignoring spaces
        .custom(async (password, { req }) => { //creating a custom validator
            const user = await usersRepo.getOneBy({ email: req.body.email });// with getOneBy function we filter the provided email which we trying to sign in
            if (!user) { //if no user with that email is found will throw this error.
                throw new Error('Invalid password');
            }
            const validPassword = await usersRepo.comparePassword(//using comparePassword method created in usersRepo to compare the password
                user.password, // we put user.password as argument to  compare(which is the password provided when the user has been created)
                password // and as second argument password the user provide when he tries to sing in
            );
            if (!validPassword) {//after comparing if validPassword is not true will throw an error Invalid Password.
                throw new Error('Invalid password');
            }
        })
};
