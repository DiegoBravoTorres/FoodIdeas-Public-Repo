const mealModel = require("../models/mealsList");
const mongoose = require('mongoose');

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    mealModel.find()
    .exec()
    .then((meal) => {
        meal = meal.map(value => value.toObject());
        // Render the "home" view with the data
        res.render("meals/home", {
            meal,
            title: "Home Page",    
        });
    });
});

router.get("/on-the-menu", (req, res) => {
    mealModel.find()
    .exec()
    .then((meals) => {   
    meals = meals.map(value => value.toObject());

    // Arrange meals by category
    let categories = [];
    for (i = 0; i < meals.length; i++) {
        let currentMeal = meals[i];
        let categoryName = currentMeal.category;
        let category = categories.find(c => c.category == categoryName);
        if (!category) {
            category = {
                category: categoryName,
                meal: []
            };
            categories.push(category);
        }
        category.meal.push(currentMeal);
    }
    
    // Send meals by category
        res.render("meals/onTheMenu", {
            categories,
            title: "Home Page",
        });
    });

});


// Meal overview

router.get("/on-the-menu/meal-overview/:id", (req, res) => {
    const mealId = req.params.id;
    mealModel.findById(mealId)
    .exec()
    .then((meal) => {   
     
        console.log(`Meal found : ${meal}`)
       
         // Send meal overview
         res.render("meals/meal-overview", {
           // mealInfo :meal,
            id : meal._id,
            img: meal.imgURL,
            title : meal.title,
            description : meal.description,
            time : meal.cookingTime,
            price : meal.price,
            servings : meal.servings,
            calories : meal.calories,
        });
    });
});


const VIEW_NAME = "purchase/shopping-cart";

const prepareViewModel = function(req, message) {

    if (req.session && req.session.user) {
        // A session has been established and the user is logged in.

        var cart = req.session.cart || [];
        var cartTotal = 0;

        // Check if songs have been added to the shopping cart.
        const hasMeals = cart.length > 0;

        // There are songs in the shopping cart, calculate the order total.
        if (hasMeals) {
            cart.forEach(cartMeals => {
                cartTotal += cartMeals.meal.price * cartMeals.qty;
            });
        }

        console.log(`Cart total: ${cartTotal}`)
        return {
            hasMeals,
            meals: cart,
            cartTotal: "$" + cartTotal.toFixed(2),
            message: message
        };
    }
    else {
        // There is no session yet, return a default/empty view model.
        return {
            hasMeals: false,
            meals: [],
            cartTotal: "$0.00",
            message: message
        };
    }
}



// Define default route for shopping cart
// I could't move this route of the controller
router.get("/purchase/shopping-cart", (req, res) => {
    if (req.session && req.session.user){
    res.render(VIEW_NAME, prepareViewModel(req));}
    else{
        res.redirect("/login")
    }
});


module.exports = router;

