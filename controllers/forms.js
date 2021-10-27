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

router.get("/welcome", (req, res) => {
    res.render("forms/welcome")
})

// Send form
router.post("/registration", (req,res) =>{
    console.log(req.body);

    const {firstName, lastName, inputEmail, inputPassword} =  req.body;

    let allGood = true;
    let validEmail = true;
    let validPassword = true;
    let errorMessages = {};

    //First Name validation
    if (typeof firstName !== 'string'|| firstName.trim().length === 0)
        {
            allGood = false;
            errorMessages.firstName = "This field is required ↓";

        } else if (firstName.trim().length < 2 )
        {
            allGood = false;
            errorMessages.firstName = "The first name should be at least 2 characters long";
            console.log("The first name should be at least 2 characters long")
        }

    //Last Name validation
    if (typeof lastName !== 'string'|| lastName.trim().length === 0)
        {
            allGood = false;
            errorMessages.lastName = "This field is required ↓";

        } else if (lastName.trim().length < 2 )
        {
            allGood = false;
            errorMessages.lastName = "The last name should be at least 2 characters long";
            console.log("The last name should be at least 2 characters long")
        }
    
    // eEmail validation
    if (typeof inputEmail !== 'string'|| inputEmail.trim().length === 0)
        {
            allGood = false;
            errorMessages.inputEmail = "This field is required ↓";

        } else if (inputEmail.trim().length < 6 )
        {
            allGood = false;
            errorMessages.inputEmail  = "The email address should be at least 6 characters long";
            console.log("The email address should be at least 6 characters long");

        } else {

            validEmail = inputEmail.includes("@");
            validEmail = inputEmail.substring(inputEmail.length - 4).includes(".");

            if (!validEmail)
            { 
                allGood = false;
                errorMessages.inputEmail = "Not the right e-mail format";
                console.log("Not the right e-mail format");
            }
        }
    
        // Password Validation
    if (typeof inputPassword !== 'string'|| inputPassword.trim().length === 0)
        {
            allGood = false;
            errorMessages.inputPassword = "This field is required ↓";
        } else if (inputPassword.trim().length <6 || inputPassword.trim().length > 12)
        {
            allGood = false;
            errorMessages.inputPassword = "The password should be between 6 and 12 characters long";
        }
        else
        {
                var upperText = /[A-Z]/;
                var lowerCase = /[a-z]/;
                var number = /[0-9]/;
                var symbol = /[^a-zA-Z0-9]/;
                if(!upperText.test(inputPassword))
                {
                    validPassword = false;
                    errorMessages.inputPassword = "The password should have at least 1 upper case character";
                } else
                if(!lowerCase.test(inputPassword))
                {
                    validPassword = false;
                    errorMessages.inputPassword = "The password should have at least 1 lower case character";
                }else
 
                if(!number.test(inputPassword))
                {
                    validPassword = false;
                    errorMessages.inputPassword = "The password should have at least 1 number";
                }
                if(!symbol.test(inputPassword))
                {
                    validPassword = false;
                    errorMessages.inputPassword = "The password should have at least 1 symbol character";
                }

                if(!validPassword){ allGood=false;}

    
        }

    if (allGood)
    {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
       

        const message ={
            to : inputEmail,
            from : 'dbravo-torres@myseneca.ca',
            subject: 'Welcome to Food Ideas',
            html: `<p style="font-size: 15px;">Hello <strong>${firstName} ${lastName} </strong><p>
            <h2>Thank you for joining our service and welcome to Food Ideas</h2>
            <img style="width: 600px;" src="https://web322-diego.herokuapp.com/images/bannerHero/OntheMenu-hero-1.jpg" alt="ideas">
            <p style="font-size: 17px;">My name is Diego Bravo and I'll be you support provider in case you need any help. <br>
             Please go to our <a href="https://web322-diego.herokuapp.com/">website</a> to start enjoying our service</p>`
            
            
        }

        sgMail.send(message)
        .then(() =>{

            res.render("forms/welcome", {
                values: req.body
            })

        }).catch(err =>{
            console.log(`Error: ${err}`)

            res.render("forms/registration",{
                title: "Page Registration",
                values: req.body, errorMessages
            });

        })

      
    }
    else{
        res.render("forms/registration",{
            title: "Page Registration",
            values: req.body, errorMessages
        });

    }
})



//Send form
router.post("/login", (req,res)=>{

    console.log(req.body);
    const {Email, Password} =  req.body;

    let allGood = true;
    let errorMessages = {};

    // eEmail validation
    if (typeof Email !== 'string'|| Email.trim().length === 0)
        {
            allGood = false;
            errorMessages.Email = "This field is required ↓";
        }

        // Password Validation
    if (typeof Password !== 'string'|| Password.trim().length === 0)
        {
            allGood = false;
            errorMessages.Password = "This field is required ↓";
        }

  //  console.log(allGood);

    if (allGood)
    {
        res.send("All good!")
    }
    else{
        res.render("forms/login",{
            title: "Page Registration",
            values: req.body, errorMessages
        });

    }
})

module.exports = router;
