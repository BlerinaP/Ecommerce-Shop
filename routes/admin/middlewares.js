const { validationResult } = require('express-validator'); //requiring validationResult from express-validator library

module.exports = {
    //dataCB = data Callback
  handleErrors(templateFunc, dataCB){ // passing a templateFunc as an argument
      //than we return a middleware function which will be called repeatedly
      //next is a callback which tells that everything is okay continue processing this req
      return async (req, res, next) => {
          const errors = validationResult(req); // this will check if the req has any errors/

            //if we have errors
          if(!errors.isEmpty()){
              let data = {};// declaring a data variable as an empty obj in case we don't have any data callback
              //if data is provided
              if(dataCB){
               data = await dataCB(req); // we update the variable //storing data in data variable
              }
              return res.send(templateFunc({ errors, ...data })); //we return the template with the errors as arguments, and data
          }
          next();
      };
  },
    // we create this function to check if no userId is found(no user is signin) redirect to sign in // then we call next() which tells that everything is okay continue processing this req
  requireAuth(req, res, next){
      if(!req.session.userId){
          return res.redirect('/signin');
      }
      next();
  }
};