const mongoose = require("mongoose");
//2) create user schema

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim:true
    },
    courseId:{
        type:String,
        trim:true
    },
    courseCode:{
        type:String,
        trim:true
    },
    startDate:{
        type:String
    }, 
    endDate:{
        type:String
    },
    place:{
        type:String,
        trim:String
    },
    instructor:{
        type:String,
        trim:true
    },
    numOfStudents:{
        type:Number
    },
    maxNumOfStudents:{
        type:Number
    },
    status:{
        type:String,
        trim:true
    },
    avaiablePlaces:{
        type:Number
    },
    sponsor:{
        type:String,
        trim:true
    }
    
});





//3) create model
const CourseSchedule = mongoose.model("Course_Schedule", courseSchema);
module.exports = CourseSchedule