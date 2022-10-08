const mongoose = require("mongoose");

//2) create user schema
const sponsorSchema = new mongoose.Schema({
   sponsorName:{
    type:String
   },
   fund:{
    type:Number
   },
   paid:{
      type:Number
   },
   numOfCourses:{
      type:Number
   }
});





//3) create model
const Sponsor = mongoose.model("sponsor", sponsorSchema);
module.exports = Sponsor