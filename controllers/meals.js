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

module.exports = router;

