const mealModel = require("../models/mealsList");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("meals/home",{
        topMeals: mealModel.getTopMeals(),
        title: "Home Page"
       
    });
});

router.get("/on-the-menu", (req, res) => {
    res.render("meals/onTheMenu",{
        mealCategories: mealModel.getAllMeals(),
   
    });

});

module.exports = router;