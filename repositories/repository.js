const fs = require('fs');//fs module is required to work with the file system.It contains different methods for reading files,creating files,updating,deleting etc.
const crypto = require('crypto');//requiring crypto module to calculate hashes for the passwords

/*Creating a class // module.exports provides us to require this file in another files. */
module.exports = class Repository {
    constructor(filename) {
        //When we create an instance of this class we will check if a file exist to store information ( ex: users.json || product.json)
        if (!filename) {
            throw new Error('Creating a repository requires a filename'); //if not throw an error
        }

        // we take whatever file is provided and store it inside the instance variable
        this.filename = filename;
        try {
            fs.accessSync(this.filename); // we use fs.accessSync to check if the file exist inside constructor
            // we use fs.accessSync to run this function as synchronunsly  because constructor function in js are not allowed do be async in nature
        } catch (err) { //if we catch the error
            fs.writeFileSync(this.filename, '[]'); // we will use fs.writeFileSync to create the file
        }
    }

    //Function created to create users/products/carts it takes some attrs (like email, password or other attrs based on the thing we are creating)
    async create(attrs) {
        attrs.id = this.randomId();// this will generate a randomId

        const records = await this.getAll(); // this will give the list of users which is read in getAll function
        records.push(attrs); // than we gonna push the new user
        await this.writeAll(records); // and here we will write the updated records back to this.filename

        return attrs;// we return the attrs
    }

    //create a function getAll
    async getAll() {
        // we use JSON.parse to make as js object because all the data we take from a webserver are always strings.
        return JSON.parse(
            // we use fs.promises.readFile to read file and return a promise
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8' //encoding the provided filename content to utf8
            })
        );
    }

    //we create a function to write all the records in the provided file
    async writeAll(records) {
        await fs.promises.writeFile( // this is used to write file in the provided filename so we pass as first argument the file name, and as second argument
            // we use JSON.stringify to converts JS in JSON
            this.filename,
            JSON.stringify(records, null, 2) // we declare the options, so value which is going to be stringified is "records", null tells tha no other function is provided to make replace, number 2 is used to make the json datas in 2 columns
        );
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex'); // we use crypto to generate a random id for the user
    }

    async getOne(id) {
        const records = await this.getAll();//reading datas in the provided file
        return records.find(record => record.id === id); // returning the record.is which is equal with the provided id(used when we need a specified record)
    }


    async delete(id) {
        const records = await this.getAll();// reading all the data in the provided file
        const filteredRecords = records.filter(record => record.id !== id); // filtering all the records that are not equal with the provided id  that we want do delete
        await this.writeAll(filteredRecords); // and re-writing all these filtered records without the record with the provided id
    }

    async update(id, attrs) {
        const records = await this.getAll(); //reading datas in provided file
        const record = records.find(record => record.id === id); // finding the record we need with the provided id

        if (!record) { //if there is no record with that id we throw an error
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs); //it will take all attrs(that we will update) and will copy them one by one into record obj => ex: email: 'test@test.com we want to update this with a password passsword: "mypass" it will take this attr password and will copy it into te record obj
        await this.writeAll(records); //we take all of the records and will write them back into the json file.
    }

    async getOneBy(filters) {
        const records = await this.getAll(); //gets all records into the json file

        for (let record of records) {  //iterate through all records
            let found = true;

            for (let key in filters) { // we will look at every key value pairs inside filters
                if (record[key] !== filters[key]) {  // we check if records of the provided key in filters object is not equal with the record we searching
                    found = false; // will return false //not found the record we lookin for
                }
            }

            if (found) { // if true
                return record; // will return the record
            }
        }
    }
};
