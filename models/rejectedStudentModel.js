const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    courseName:{
        type:String
    },
    requiredSkills:[{
        type:String
    }],
    testResult:{
        type:Number
    },
    numOfRejection:{
        type:Number
    }
});





//3) create model
const RejectedStudnet = mongoose.model("Rejected_Student", studentSchema);
module.exports = RejectedStudnet