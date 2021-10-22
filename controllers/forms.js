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

// Send form
router.post("/registration", (req,res) =>{
    console.log(req.body);

    const {firstName, lastName, inputEmail, inputPassword} =  req.body;

    let allGood = true;

    if (typeof firstName !== 'string'|| firstName.trim().length === 0)
        {allGood = false;}

    if (typeof lastName !== 'string'|| lastName.trim().length === 0)
        {allGood = false;}
    
    if (typeof inputEmail !== 'string'|| inputEmail.trim().length === 0)
        {allGood = false;}
    
    if (typeof inputPassword !== 'string'|| inputPassword.trim().length === 0)
        {allGood = false;}

    if (allGood)
    {
        res.send("All good!")
    }
    else{
        res.render("forms/registration",{
            title: "Page Registration",
            values: req.body
        });

    }
})



//Send form
router.post("/login", (req,res)=>{
    res.json(req.body);
})

module.exports = router;
