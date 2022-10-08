const CourseSchedule = require("../models/courseScheduleModel");
const CourseDef = require("../models/courseDefModel");
const RejectedStudnet = require("../models/rejectedStudentModel");
const StudentInCourse = require("../models/studentInCourseModel");
const Studnet = require("../models/studentModel");
const Sponsor = require("../models/sponsorModel");


let createCourse = async (req, res) => {
    try {
        let today = new Date().toISOString().split("T")[0];
        let start = new Date(req.body.startDate).toISOString().split("T")[0];
        let endDate = new Date(req.body.endDate).toISOString().split("T")[0];
        //console.log(today, start, endDate);
        if (today > start)
            throw new Error("Dates Are Invalid");
        //let start = new Date(req.body.startDate).toISOString().split('T')[0];
        //let endDate = new Date(req.body.endDate).toISOString().split('T')[0];
        //startDate.setMonth(startDate.getMonth()+1);
        //console.log(startDate, endDate);
        //find({courseCode: (req.body.courseName).toLowerCase()+"101"}).select({courseId:1,_id:0}).sort({courseId:1}).exec()
        //startDate = new Date(startDate));
        //startDate.setHours(0,0,0,0);
        let courseCode = (req.body.courseName).toLowerCase() + "101";
        let countOfThisCourse = await CourseSchedule.countDocuments({ courseCode: courseCode });
        // console.log(courseCode);

        let courseId = courseCode + "#" + (countOfThisCourse + 1);
        let numOfStudents = req.body.numOfStudents ? req.body.numOfStudents : 0;
        let maxNumOfStudents = req.body.maxNumOfStudents ? req.body.maxNumOfStudents : 40;
        //console.log(numOfStudents)
        if (start > endDate)
            throw new Error("Dates Are Invalid");
        let course = new CourseSchedule({
            courseName: req.body.courseName,
            courseId: courseId,
            courseCode: courseCode,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            place: req.body.place,
            instructor: req.body.instructor,
            numOfStudents: numOfStudents,
            maxNumOfStudents: maxNumOfStudents,
            status: "not Started",
            avaiablePlaces: (maxNumOfStudents - numOfStudents),
            sponsor: req.body.sponsor
        });
        let sponsorCoursesNum = await Sponsor.find({ sponsorName: course.sponsor }).select({ _id: 0, numOfCourses: 1 });
        let numOfCourses = sponsorCoursesNum[0].numOfCourses;
        await Sponsor.findOneAndUpdate({ sponsorName: course.sponsor }, { numOfCourses: numOfCourses + 1 });
        //console.log(numOfCourses);
        course.save();
        return res.status(200).json({
            status: "Success",
            message: course
        });
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            message: err.message
        });
    }
};


let getCourses = async (req, res) => {
    let page = req.query.page ? req.query.page : 1;
    let pageSize = req.query.pageSize ? req.query.pageSize : 5;
    let skippedDocs = ((page - 1) * pageSize);
    let courses = await CourseSchedule.find().skip(skippedDocs).select({ _id: 0, __v: 0 }).limit(pageSize).exec();
    res.status(200).json(courses);
}





let courseEnrollment = async (req, res) => {
    try {
        let response, testResult = 0;
        let courseCode = (req.body.courseName).toLowerCase() + "101";
        let prerequistesObject = await CourseDef.find({ courseCode: courseCode }).select({ prerequistes: 1, _id: 0 }).exec();
        let prerequistes = prerequistesObject[0].prerequistes;
        let studentObject = await Studnet.find({ email: req.body.email }).select({ badgeId: 1, _id: 0, testResult: 1 }).exec();
        let skills = studentObject[0].badgeId;
        console.log("this is skills, ", skills);
        let badges = [];
        prerequistes.forEach(element => {
            badges.push(element.toLowerCase() + "101");
        })
        let checkForSkillsResult = checkForSkills(skills, badges);
        if (checkForSkillsResult != true) {
            testResult = studentObject[0].testResult;
            if (testResult > 7) {
                response = await addToCourse(courseCode, req.body.email);
            }
            else {
                let numOfRejection = 1;
                let rejectedBefore = await RejectedStudnet.findOne({ email: req.body.email, courseName: req.body.courseName }).exec()
                if (rejectedBefore) {
                    numOfRejection = rejectedBefore.numOfRejection + 1;
                    await RejectedStudnet.findOneAndUpdate({ email: req.body.email, courseName: req.body.courseName }, { numOfRejection: numOfRejection }).select({ _id: 0, __v: 0 }).exec();
                    rejectedBefore = await RejectedStudnet.findOne({ email: req.body.email, courseName: req.body.courseName }).exec()
                    console.log(rejectedBefore);
                    response = {
                        "stat": 400,
                        "status": "Failed",
                        "message": rejectedBefore
                    }
                }
                else {
                    response = { "stat": 400, "status": "Failed", "message": "Result Score is lower than 7!" };
                    let rejectedStudent = new RejectedStudnet({
                        email: req.body.email,
                        courseName: req.body.courseName,
                        requiredSkills: checkForSkillsResult,
                        testResult: testResult,
                        numOfRejection: numOfRejection
                    });
                    rejectedStudent.save();
                    response = {
                        "stat": 400,
                        "status": "Failed",
                        "message": rejectedStudent
                    }
                }

            }

        } else {
            response = await addToCourse(courseCode, req.body.email);
            //console.log(typeof message);

            //console.log(message);
        };
        res.status(response.stat).json({
            status: response.status,
            message: response.message
        });
    }
    catch (err) {
        res.status(400).json({
            status: "Failed",
            message: err.message
        });
    }
}

let addToCourse = async (courseCode, email) => {
    try {
        let courseSchedule = await CourseSchedule.find({ courseCode: courseCode, avaiablePlaces: { $gt: 2 }, status: "not Started" }).sort({ avaiablePlaces: 1, numOfStudents: -1 }).limit(1).exec();
        let exist = await StudentInCourse.findOne({ email: email, status: "not Started" }).select({ _id: 0, courseName: 1 }).exec();
        //console.log(exist);
        if (exist)
            throw new Error(`Student is Already registered in ${exist.courseName} Course`);
        let cNewourse = await CourseSchedule.findOneAndUpdate({
            courseId: courseSchedule[0].courseId
        }
            , {
                numOfStudents: (courseSchedule[0].numOfStudents) + 1,
                avaiablePlaces: (courseSchedule[0].maxNumOfStudents) - (courseSchedule[0].numOfStudents) - 1
            });


        let studentInCourse = new StudentInCourse({
            email: email,
            courseName: courseSchedule[0].courseName,
            courseId: courseSchedule[0].courseId,
            attendance: 0,
            status: courseSchedule[0].status,
            place: courseSchedule[0].place
        })
        studentInCourse.save();
        return ({
            "stat": 400,
            "status": "Success",
            "message": studentInCourse
        });
    }
    catch (err) {
        //console.log(err.message);
        return ({
            "stat": 400,
            "status": "Failed",
            "message": err.message
        });
    }
}

let checkForSkills = (skills, prerequistes) => {
    let intersectionSkill = prerequistes.filter(x => skills.includes(x));
    //console.log("intersectionSkill, ", intersectionSkill);
    if (intersectionSkill.length == prerequistes.length)
        return true;
    let diffSkill = prerequistes.filter(x => !skills.includes(x));
    console.log(diffSkill);
    return diffSkill;
}






let updateCourse = async (req, res) => {
    try {
        let courseGroup = req.query.group ? req.query.group : null;
        if(!courseGroup)
            throw new Error("Course Group is Required");
        let courseName = req.query.courseName ? req.query.courseName:null; 
        if(!courseName)
            throw new Error("Course Name is Required");
        let courseId = (req.query.courseName).toLowerCase() + "101#" + courseGroup;
        let found = await CourseSchedule.findOne({ courseId: courseId }).exec();
        if (found) {

            await CourseSchedule.findOneAndUpdate({ courseId: courseId }, req.body);
            let updatedCourseSchedule = await CourseSchedule.findOne({ courseId: courseId }).exec();
            return res.status(200).json({
                status: "Success",
                message: updatedCourseSchedule
            });
        } else {
            throw new Error("Course Not Found!!");
        }
    }
    catch (err) {
        return res.status(401).json({
            status: "Failed",
            message: err.message
        });
    }

}


module.exports = {
    createCourse,
    getCourses,
    courseEnrollment,
    updateCourse
}