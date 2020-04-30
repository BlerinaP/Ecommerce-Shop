module.exports = {
    getError(errors, prop){
        try{
            return errors.mapped()[prop].msg;
        } catch (err) {
            return '';
        }
    }
};
//This function is created to geterror of the provided prop(email,pass or pass confirmation) we use map
//to iterate through props and give me msg which show what kind of error is accrued
// if no error is accrued return nothing.