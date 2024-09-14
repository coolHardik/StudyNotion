const mongoose = require("mongoose");  //! Mongoose is being reuired
require("dotenv").config();

// Connect with Database
exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(function(){
        //console.log("DB connection successfull")
    }).catch(function(err){
        console.error(err);
        //console.log("DB connection failed");
        process.exit(1);
    })
};
