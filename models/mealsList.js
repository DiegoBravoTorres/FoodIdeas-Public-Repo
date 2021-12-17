const mongoose = require('mongoose');
const schema = mongoose.Schema;


const mealSchema = new schema({

    "title": {
        type: String,
        required: true,
        unique:true
    },
    "ingredients":String,
    "description": String,
    "price": Number,
    "cookingTime" : Number,
    "servings":Number, 
    "calories": Number,
    "imgURL": String,
    "topMeal": Boolean,
    "category": String

});


const mealModel = mongoose.model("meals", mealSchema);
module.exports = mealModel;




