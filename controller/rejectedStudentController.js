const RejectedStudnet = require("../models/rejectedStudentModel");
const CourseSchedule = require("../models/courseScheduleModel");

let getRejected = async (req, res) => {
    try {
        
        let rejectedStudents = await RejectedStudnet.find({}).select({ _id: 0, __v: 0 }).exec();
        let rejectedEmail = (req.query.email?req.query.email:null);
        if(rejectedEmail==null)             
            res.status(200).json({
                status: "Success",
                message: rejectedStudents
            })
        else{
            let rejectedStudent = await RejectedStudnet.findOne({email:rejectedEmail}).select({ _id: 0, __v: 0 }).exec();
            console.log(!rejectedStudent?rejectedStudent:"test");
            if(rejectedStudent)
                res.status(200).json({
                    status: "Success",
                    message: rejectedStudent
                })
            else
                throw new Error("Student Isn't Found!!");
        }
    }
    catch (err) {
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
}

let sendRecommendation = async(req, res)=>{
    try{
        let multiple_recommendation = req.query.multiple?true:false;

        if(multiple_recommendation){
            let mostFrequentRejectedStds = await RejectedStudnet.find({}).sort({numOfRejection:-1}).select({_id:0}).limit(5);
            //console.log(mostFrequentRejectedStds);
            let response = [];
            mostFrequentRejectedStds.forEach(element=>{
                response.push(`Course Recomendation is sent to ${element.email} about ${element.requiredSkills[0].split("1")[0].toUpperCase()} Course`)
            })
            return res.status(200).json({
                status:"Success",
                message:response
            });
        }
        let mostFrequentRejected = await RejectedStudnet.find({}).sort({numOfRejection:-1}).select({_id:0}).limit(1);

        let rejectedEmail = (req.query.email?req.query.email:null);
        if(rejectedEmail==null)             
            res.status(200).json({
                status:"Success",
                message:`Course Recomendation is sent to ${mostFrequentRejected[0].email} about ${mostFrequentRejected[0].requiredSkills[0].split("1")[0].toUpperCase()} Course`
            })
        else{
            let rejectedStudent = await RejectedStudnet.findOne({email:rejectedEmail}).select({ _id: 0, __v: 0 }).exec();
            console.log(rejectedStudent)

            if(rejectedStudent)
                res.status(200).json({
                    status: "Success",
                    message:`Course Recomendation is sent to ${rejectedStudent.email} about ${rejectedStudent.requiredSkills[0].split("1")[0].toUpperCase()} Course`
                })
            else
                throw new Error("Student Isn't Found!!");
        }        
       
    }
    catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
}


module.exports = {
    getRejected,
    sendRecommendation
}

