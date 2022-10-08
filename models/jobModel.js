const mongoose = require("mongoose");
//2) create user schema

const jobSchema = new mongoose.Schema({
   jobTitle:{
      type:String
   },
   jobDescription:{
    type:String
   },
   jobRequirements:[{
    type:String
   }]
});





//3) create model
const Job = mongoose.model("job", jobSchema);
module.exports = Job