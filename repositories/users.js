const fs = require('fs'); //fs module is required to work with the file system.It contains different methods for reading files,creating files,updating,deleting etc.
const crypto = require('crypto'); //requiring crypto module to calculate hashes for the passwords
const util = require('util');//
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);// util.promisify is used to take the function callback and return a version that return promises
// so we take scrypt function which is inside scrypt function which is inside the crypto module and make it to return a promise so qe can use async and await

class UsersRepository extends Repository { // creating new class which extends another created class.

    /*Creating a function to compare password with password confirmation*/
    async comparePassword(saved, supplied){
        //Saved -> password saved in our database. 'hashed.salt'
        //Supplied -> password given to us by the user trying to sign in

        /*const result = saved.split('.')
        * const hashed = result[0];
        * const salt = result[1]
        * */

        //we split hashed pass with and salt
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);// we take the password the user supplied as pass, and salt as sec arg( wish scrypt we take back datas a buffer)

        return hashed === hashedSuppliedBuf.toString('hex'); // here we compare passwords and to we turn the buffer data into hex
    }

    /*Function which is used to create something(user, product, cart) */
    async create(attrs){// attrs provide for ex: { email: '', password: ''}
        attrs.id = this.randomId(); //generating random id
        //Process of hashing the password
        const salt = crypto.randomBytes(8).toString('hex'); //salting the password( this will give as a random series of numbers and letter for our salt)
        const buf = await scrypt(attrs.password, salt, 64,); // we assign put as arguments password provided, salt value , and 64)

        const records = await this.getAll(); // we get attr of  of the record
        const record = {
            ...attrs,// it copies all the arguments in attrs obj and create a new obj and we overwrite the password attr
            password: `${buf.toString('hex')}.${salt}` // we create the hashed password so taking the buffer data which are created by scrypt turn them into hex data and assign the salt value
        };
        records.push(record);// we just push the new record into record
        await this.writeAll(records); //we take all of the records and will write them back into the json file.

        return record; //s
    }
}

module.exports = new UsersRepository('users.json');
