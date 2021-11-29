const mongoose = require('mongoose');
const schema = mongoose.Schema;


const mealSchema = new schema({

    "title": String,
    "ingredients":String,
    "description": String,
    "price": Number,
    "cookingTime" : Number,
    "servings":Number, 
    "calories": Number,
    "imgURL": String,
    "topMeal": Boolean

});


const mealModel = mongoose.model("meals", mealSchema);
module.exports = mealModel;




