const Repository = require('./repository');
//creating a repository for carts. Creating a class which extends another class will all the function created in it(Repository from repository.js)
class CartsRepository extends Repository {}

module.exports = new CartsRepository('carts.json')// and we create new instance of class with the provided file name to store the datas