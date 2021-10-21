const express = require("express");
const router = express.Router();



router.get("/registration", (req, res) => {
    res.render("forms/registration",{
   
    });

});

router.get("/login", (req, res) => {
    res.render("forms/login",{
    
    });

});

module.exports = router;
