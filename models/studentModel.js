const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    badgeId:[{
        type:String
    }],
    testResult:{
        type:Number
    }
});





//3) create model
const Studnet = mongoose.model("Student", studentSchema);
module.exports = Studnet