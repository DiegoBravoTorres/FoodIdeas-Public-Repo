const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

//Define the user schema

const usersShema = new schema ({
    fname : {type:String,
                required: true},
    lname : {type:String,
                required: true},
    email : {type:String,
                required: true, 
                unique:true},
    password : {type:String,
                required: true},
    profilePic : {
                type:String},
    dateCreated : {
                type:Date, 
                default: Date.now()}
});

usersShema.pre("save", function(next){
    let user = this;

    // Generate salt
    bcrypt.genSalt(10)
    .then((salt) => {
    // Hashing rather than encrypting
        bcrypt.hash(user.password, salt)
        .then((hashedPwd)=> {
            // Update user model
            user.password = hashedPwd;
            next();

         }).catch((error)=>{
            console.log(`There was an error hashing: ${err}`)
         })

    }).catch((err)=>{
        console.log(`There was an error salting: ${err}`)
    })


});

const userModel = mongoose.model("users", usersShema);
module.exports = userModel;
