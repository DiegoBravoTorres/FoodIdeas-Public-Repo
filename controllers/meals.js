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

// Add item to shopping cart
router.get("/customer/shopping-cart/:id", (req,res) =>{

    var found = false;
    var message;
    if(!req.session.userIsClerk && req.session.user){

    const mealId = req.params.id;
    mealModel.findById(mealId)
    .exec()
    .then((meal) => {   
       
        var cart = req.session.cart = req.session.cart || [];
      //  cart.push(meal);  
        console.log(`Cart : ${cart}`)


        cart.forEach(cartMeal => {
            if (cartMeal.id == mealId) {
                // Song was already in the shopping cart (increment the quantity).
                found = true;
                cartMeal.qty++;
            }
        });

        if (found) {
            message = "Song was already in the cart, incremented the quantity by one.";
        }
        else {
            // Song was not found in the shopping cart.  Create a new shopping
            // cart object and add it to the cart.
            cart.push({
                id: mealId,
                qty: 1,
                meal
            });

            console.log(`Meal added: ${meal}`)
        }
       
        prepareViewModel(req, message)
       // res.render(VIEW_NAME, prepareViewModel(req, message));
        res.redirect("/purchase/shopping-cart");
    });

}
    else
    {
        res.redirect("/login")
    }
});


// Define default route for shopping cart
router.get("/purchase/shopping-cart", (req, res) => {
    res.render(VIEW_NAME, prepareViewModel(req));
});



// Delete item on shopping cart
router.get("/customer/remove-meal/:id", (req, res)=>{

    const mealId = req.params.id;

    if (req.session.user) {
        var cart = req.session.cart || [];

        // Find the meal in the shopping cart.
        const index = cart.findIndex(cartMeal => { return cartMeal.id == mealId });

        if (index >= 0) {
            // Meal was found in the shopping cart.
            
            message = `Removed "${cart[index].meal.title}" from the cart`;
            cart.splice(index, 1);
            console.log(message);
            
        }
        else {
        // Song was not found in the shopping cart, nothing to do.
            message = "Meals was not found in your cart.";
        }
    }
    else {
        // Not logged in
        message = "You must be logged in.";
    }

    prepareViewModel(req, message)
    res.redirect("/purchase/shopping-cart");


});


// Define Check-out

router.get("/check-out",(req,res) =>{

    if (req.session.user) {

        var cart = req.session.cart || [];
        var cartTotal =0;

        if (cart.length > 0) {
           
           cart.forEach(cartMeals => {
            cartTotal += cartMeals.meal.price * cartMeals.qty;
        });

           const sgMail = require("@sendgrid/mail");
           sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
          
   
           var message ={
               to : req.session.user.email,
               from : 'dbravo-torres@myseneca.ca',
               subject: 'Your order confirmation',
               html: `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet"> 
               <div style="font-family: 'Montserrat', sans-serif; text-align: center;">
               <p style="font-size: 16px;">Hello <strong>${req.session.user.fname} ${req.session.user.lname}!</strong><p>
               <p style="font-size: 16px;">Your order has been placed for the next meals:</p>
               `
           }
    
             cart.forEach(cartMeal => {
                message.html += `<p style="font-size: 16px;">${cartMeal.meal.title}<br>Qty: <strong>${cartMeal.qty}</strong><br>Price/Item:<strong> $${cartMeal.meal.price}</strong></p>`
                
             });


             message.html += `<hr><p style="font-size: 16px;">Order Total: <strong>$${cartTotal.toFixed(2)}</strong></p>
                             
                              <p style="font-size: 16px;">Thank you for using Food Ideas</p>
                              <img style="width: 600px;height: 130px;" src="https://web322-diego.herokuapp.com/images/bannerHero/OntheMenu-hero-1.jpg" alt="Food Ideas Banner></div>`;

   
           sgMail.send(message)
           .then(() =>{
   
               console.log(`Mail succesfully sent`)
   
           }).catch(err =>{
               console.log(`Error: ${err}`)
 
           })
            
            // Don't want to do this
            //req.session.destroy();
            req.session.cart = [];
        }

        //res.send(`thanks for shopping${req.session.user.fname},${req.session.user.lname}, ${req.session.user.email}`)
        res.render("purchase/order-placed",{

        });

    }



})

module.exports = router;

