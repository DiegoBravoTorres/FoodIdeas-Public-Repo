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



//Update Meals,

router.get("/load-data/update-meal-kits",(req,res)=>{

    if (req.session.user && req.session.userIsClerk)
    {

    mealModel.find()
    .exec()
    .then((meals) =>{
        meals = meals.map(value => value.toObject());

        res.render("meals/updateMeals",{
                meals
        })
    })
}else{
    console.log("You are not a clerk")
        res.render("meals/notAccess", {
        });

}

});

router.post("/load-data/update-meal-kits",(req,res)=>{

    console.log("Info sent to update");
    console.log(req.body);
    //console.log(req.files.image);
    

    let messages =[];
    const {id,title, ingredients, description, category, price, time, calories, servings, isTop} =  req.body;
    

   
    if(req.files){

        let imageName = `meal-pic-${req.body.title}${path.parse(req.files.image.name).ext}`;
        req.files.image.mv(`static/images/meals/${imageName}`)

        mealModel.updateOne({
            _id : id
    
        },{
            "$set":{"title": req.body.title,
            "ingredients": req.body.ingredients,
            "description": req.body.description,
            "category":req.body.category,
            "price": req.body.price,
            "time": req.body.time,
            "calories": req.body.calories,
            "servings": req.body.servings
            ,"imgURL" : imageName
    
        }
             
        }).then(() => {
    
            mealModel.find()
            .exec()
            .then((meals) =>{
                meals = meals.map(value => value.toObject());
        
                messages.created = `${req.body.title} updated succesfully`;
                res.render("meals/updateMeals", {
                    values: messages, meals
                });
            })
    
    
        }).catch((err) => {
            
            console.log(`Could not save meal because : ${err}`)
        })


    }else{

        mealModel.updateOne({
            _id : id
    
        },{
            "$set":{"title": req.body.title,
            "ingredients": req.body.ingredients,
            "description": req.body.description,
            "category":req.body.category,
            "price": req.body.price,
            "time": req.body.time,
            "calories": req.body.calories,
            "servings": req.body.servings        
    
        }
             
        }).then(() => {
    
            mealModel.find()
            .exec()
            .then((meals) =>{
                meals = meals.map(value => value.toObject());
        
                messages.created = `${req.body.title} updated succesfully`;
                res.render("meals/updateMeals", {
                    values: messages, meals
                });
            })
    
    
        }).catch((err) => {
            
            console.log(`Could not save meal because : ${err}`)
        })
    }
})


router.get("/load-data/delete-meal/:id",(req,res)=>{

    const mealId = req.params.id;
    mealModel.deleteOne({ _id:mealId})
    .exec().then(()=>{
        console.log(`Meal with Id ${mealId}, sucesfully deleted`);
        res.redirect("/load-data/update-meal-kits");
       
    }).catch((err) =>{

        console.log(`Error: there was an error: ${err}`);
    });
})


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

