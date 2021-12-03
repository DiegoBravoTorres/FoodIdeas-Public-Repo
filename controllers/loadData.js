const mealModel = require("../models/mealsList");
const path = require("path")

const express = require("express");
const router = express.Router();


let messageData =[];

router.get("/load-data/meal-kits", (req,res) =>{
    
        messageData.meals =`Meal kits have already been added to the database`;
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
                       
                        console.log("Added meal kits to the database");
                        messageData.meals = `Added meal kits to the database`;
                    }
                });
            }
            else {
                console.log("Meal kits have already been added to the database");
                messageData.meals = `Meal kits have already been added to the database`;
            }
        });

        //Once we add the data for the first time, render the view 

        console.log(messageData);

        res.render("meals/addMeals", {
            values: req.body, messageData
        });

    }else{
        console.log("You are not a clerk")
        res.render("meals/notAccess", {
        });
    }
})



// Add meals
router.post("/load-data/meal-kits", (req,res)=>{

    let messages =[];
    
    console.log(req.body);
    const {title, ingredients, description, category, price, time, calories, servings, isTop} =  req.body;

    let isthisaTop = isTop === "on";

   /* mealModel.findOne({
        title: req.body.title
    }).then(found =>{

        if(found){

            mealModel.updateOne({
                _id: found._id
            },{
                title:
            })

        }else{


        }


    }).catch((err) =>{
        messages.error = `Could not update ${title} meal because ${err}`;   
    })*/

     // Add user to Mongoose DB
     let newMeal = new mealModel({
        title: title,
        ingredients: ingredients,
        description: description,
        category: category,
        price:price,
        cookingTime: time,
        topMeal: isthisaTop,
        servings: servings,
        calories: calories
       // imgURL:req.files.image
    });

    newMeal.save()
    .then((mealSaved)=> {
    console.log(`${mealSaved.title} succesfully saved`);

    //Create a name and store it in the filesystem
    let imageName = `meal-pic-${mealSaved.title}${path.parse(req.files.image.name).ext}`;
    
    //Copy the image data into the static folder

    req.files.image.mv(`static/images/meals/${imageName}`).then(() =>{
        // Update Document
        mealModel.updateOne({
            _id : mealSaved._id

        },{
            imgURL: imageName
        }).then(() => {

            messages.created = `${mealSaved.title} succesfully saved`;
            res.render("meals/addMeals", {
                values: req.body, messages
            });


        }).catch((err) => {
            
            console.log(`Could not save image because : ${err}`)
        })
    });

    }
    ).catch((err) =>{

        messages.created = `Error: ${mealSaved.title} already exist`;
    // If user could not be created ..
    messages.error = `Could not ${title} meal because ${err}`;    
    res.render("meals/addMeals",{
        values: req.body, messages
    });

    })
});

//Update Meals,

router.get("/load-data/update-meal-kits",(req,res)=>{

    mealModel.find()
    .exec()
    .then((meals) =>{
        meals = meals.map(value => value.toObject());

        res.render("meals/updateMeals",{
                meals
        })
    })
    

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



module.exports = router;

