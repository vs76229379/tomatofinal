const mongoose = require('mongoose')
const mongoURI = 'mongodb+srv://tomato:7622937912@cluster0.skiyher.mongodb.net/tomatomern?retryWrites=true&w=majority' // Customer change url to your db you created in atlas

const mongoDB =async() =>{
   await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {

        if (err) console.log("---", err);
        else {

            console.log("connected to mongo");
            const foodCollection = await mongoose.connection.db.collection("food_items");
            foodCollection.find({}).toArray(async function (err, data) {
                const foodCategory = await mongoose.connection.db.collection("foodCategory");
                foodCategory.find({}).toArray(function(err,catData) {
                    if (err) console.log(err);
                  else{
                    global.food_items = data;
                    global.foodCategory = catData;
                } 
                })
                //if (err) console.log(err);
                //else{
                   // global.food_items = data; 
                   
              //  }

            });
        }


    });
    
}

module.exports = mongoDB();