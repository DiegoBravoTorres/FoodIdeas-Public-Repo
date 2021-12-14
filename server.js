/************************************************************************************ 
 *  WEB322 – Project (Fall 2021) 
 *  I declare that this assignment is my own work in accordance with Seneca Academic 
 *  Policy. No part of this assignment has been copied manually or electronically from 
 *  any other source (including web sites) or distributed to other students. 
 *    
 *  Name: Diego Bravo
 *  Student ID: 138350202
 *  Course/Section: WEB322 ZAA
 * 
 *  ************************************************************************************/


const path = require("path");

//const mealModel = require("./models/mealsList");

// Include ExpressJS in our project
const express = require("express");
const exphbs = require('express-handlebars');
const session = require("express-session");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
//const bodyParser = require('body-parser');



const dotenv = require('dotenv');
dotenv.config({path:"./config/keys.env"});

const app = express();

// Configure Handlebars
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: "main"
}));

app.set('view engine','.hbs');



// Configure express session

app.use(session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next)=>{
    // Set local variable "user"
    res.locals.user = req.session.user;
    // Set local variable "userIsClerk "
    res.locals.userIsClerk  = req.session.userIsClerk ;
   // res.locals.cart  = req.session.cart ;
    next();
});


// Configure Body Parser
app.use(express.urlencoded({ extended:false}));

// Set up File Upload
app.use(fileUpload());


// Setup a folder that contains static resources.
app.use(express.static("static"));


// Connect to the MongoDB
mongoose.connect(process.env.MONGOOSE_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
).then(() =>{
    console.log("Connected to MongoDB");
}).catch((err) =>{
    console.log(`Could not connect to Mongo because: ${err}`);
})


//Import Controllers

const mealsController = require("./controllers/meals");
const userController = require("./controllers/user");
const loadDataController = require("./controllers/loadData");


app.use("/",mealsController);
app.use("/", userController);
app.use("/", loadDataController);



//Internal pages route configuration


app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.send(headers);

});


// *** THE FOLLOWING CODE SHOULD APPEAR IN YOUR ASSIGNMENT AS IS (WITHOUT MODIFICATION) ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("404: Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8087;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
