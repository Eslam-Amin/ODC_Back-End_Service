const mongoose = require("mongoose");
//2) create user schema

const courseSchema = new mongoose.Schema({
    globalPath : {
        type : String,
        trim:true,
    },
    localPath : {
        type : String,
        trim:true
    },
    course:{
        type:String,
        trim:true
    },
    courseCode:{
        type:String,
        trim:true
    },
    skillsCovered: [{
        type: String
    }],
    prerequistes: [{
        type: String
    }],
    badge:{
        type:String,
        trim:true
    }
});





//3) create model
const Course = mongoose.model("Course_Def", courseSchema);
module.exports = Course