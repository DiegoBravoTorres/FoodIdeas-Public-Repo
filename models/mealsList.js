var mealsList = [
    {
       category: "Italian",
       mealKits:[
           {
                title: "Italian Pasta with Tomato with Seafood",
                ingredients:"Imported Pasta and organic tomatoes along with other spices",
                description: "A delicious pasta with the spirit of Italy",
                price: 21.99,
                cookingTime : 20,
                servings:2, 
                calories: 600,
                imgURL: "italian-pasta-seafood.jpg",
                topMeal: false
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
                topMeal: true

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
            topMeal: true

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
            topMeal: true

       }
       ]
    },
    {
        category: "Breakfast",
        mealKits:[
            {
                 title: "Blueberry Pancakes",
                 ingredients:"Blueberries, butter, flour, syrup and sugar",
                 description: "The perfect breakfast with blueberries on the top",
                 price: 10.99,
                 cookingTime : 40,
                 servings:2, 
                 calories: 400,
                 imgURL: "blueberry-pancakes.jpg",
                 topMeal: false
            }
        ]
    }   
]


module.exports.getAllMeals = function(){
    return mealsList;
}

module.exports.getTopMeals = function(){

   // mealsList.flat(2);
    var topMeals = [];

    for (var i =0; i < mealsList.length ; i++)
    {
        for (var y =0; y < mealsList[i].mealKits.length ; y++)
        {
            // console.log(mealsList[i].mealKits[y].title);
            if (mealsList[i].mealKits[y].topMeal)
            {topMeals.push(mealsList[i].mealKits[y]);}
        }
    }
return topMeals;
}