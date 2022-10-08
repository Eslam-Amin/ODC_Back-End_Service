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
    courseId:{
        type:String
    },
    attendance:{
        type:Number
    },
    status:{
        type:String
    },
    place:{
        type:String
    }
});





//3) create model
const studentInCourse = mongoose.model("Student_in_Course", studentSchema);
module.exports = studentInCourse