const mealModel = require("../models/mealsList");

const express = require("express");
const router = express.Router();

router.get("/load-data/meal-kits", (req,res) =>{
    if (req.session.user && req.session.userIsClerk)
    {
        mealModel.find().count({}, (err, count) => {
            if (err) {
                console.log("Couldn't find: " + err);
            }
            else if (count === 0) {

                var initialMeals = [
                    {
                        title: "Italian Pasta with Tomato with Seafood",
                        ingredients:"Imported Pasta and organic tomatoes along with other spices",
                        description: "A delicious pasta with the spirit of Italy",
                        price: 21.99,
                        cookingTime : 20,
                        servings:2, 
                        calories: 600,
                        imgURL: "italian-pasta-seafood.jpg",
                        topMeal: false,
                        category: "Italian"
                    },
                    {
                        title: "Pepperoni and Salamy Sandwich",
                        ingredients:"Bread, pepperoni and imported salamy",
                        description: "Gourmet Sandwich made with the best quality products",
                        price: 14.99,
                        cookingTime : 10,
                        servings:3, 
                        calories: 400,
                        imgURL: "pepperoni-salamy-sandwich.jpg",
                        topMeal: true,
                        category: "Italian"
                    
                    },
                    {
                        title: "Homemade Lasagna",
                        ingredients:"Spinach, cheese, pasta layers and meat sauce",
                        description: "The original recipie from italy to your table",
                        price: 25.99,
                        cookingTime : 50,
                        servings:4, 
                        calories: 900,
                        imgURL: "homemade-lasagna.jpg",
                        topMeal: true,
                        category: "Italian"
                    
                    },
                    {
                        title: "Organic Pizza",
                        ingredients:"Cheery tomates, cheese, tomatoe sauce, mushrooms and flour",
                        description: "The best organic pizza you've done",
                        price: 16.99,
                        cookingTime : 45,
                        servings:2, 
                        calories: 1000,
                        imgURL: "organic-pizza.jpg",
                        topMeal: true,
                        category: "Italian"       
                        },
                        {
                       
                        title: "Blueberry Pancakes",
                        ingredients:"Blueberries, butter, flour, syrup and sugar",
                        description: "The perfect breakfast with blueberries on the top",
                        price: 10.99,
                        cookingTime : 40,
                        servings:2, 
                        calories: 400,
                        imgURL: "blueberry-pancakes.jpg",
                        topMeal: false,
                        category: "Breakfast",
                        }   
                ];
            
                mealModel.collection.insertMany(initialMeals,  (err, docs) => {
                    if (err) {
                        console.log("Couldn't insert: " + err);
                    }
                    else {
                        console.log("Success, data was loaded!");
                    }
                });
            }
            else {
                console.log("Sorry, the data is already loaded.");
            }
        });

        //Once we add the data for the first time, render the view 

        res.render("meals/addMeals")

    }else{
        console.log("You are not a clerk")
    }
})

module.exports = router;

