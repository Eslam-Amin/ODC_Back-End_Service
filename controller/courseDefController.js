const Course = require("../models/courseDefModel");

let addCourse = async (req, res) => {
    try {
        req.body.courseCode = ((req.body.course).toLowerCase()).trim() + "101";
        //check for exitence
        let found = await Course.findOne({ courseCode: req.body.courseCode }).exec();
        if (found)
            return res.status(400).json({
                status: "Failed",
                error: "Course Already EXSITED..."
            });
        let course = new Course({
            globalPath: req.body.globalPath,
            localPath: req.body.localPath,
            course: req.body.course,
            courseCode: req.body.courseCode,
            skillsCovered: req.body.skillsCovered,
            prerequistes: req.body.prerequistes,
            badge: req.body.badge
        });
        await course.save();
        console.log(course);

        res.json({
            status: "Success",
            courseAdded: course
        });
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).json({
            status: "Failed",
            error:err.message
        });
    }
};

let updateCourse = async (req, res) => {
    try {
        let courseUpdated = await Course.findOneAndUpdate({ courseCode: req.params.courseCode }, req.body);
        console.log(courseUpdated);
        return res.status(200).json({
            status: "Success",
            message: updateCourse
        });
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error:err.message
        });
    }
}
/*
let deleteCourse = async(req, res)=>{
    let courseDeleted
};
*/
let getAllCourses = async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : 1;
        let pageSize = req.query.pageSize ? req.query.pageSize : 5;
        let skippedDocs = ((page - 1) * pageSize);
        let courses = await Course.find().skip(skippedDocs).select({ _id: 0, __v: 0 }).limit(pageSize).exec();

        return res.status(200).json({
            status: "Success",
            message: courses
        })
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error:err.message
        });
    }

}

module.exports = { addCourse, updateCourse, getAllCourses };