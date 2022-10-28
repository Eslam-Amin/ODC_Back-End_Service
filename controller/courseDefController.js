const Course = require("../models/courseDefModel");
const KMPSearch = require("../controller/searchSimilarWordController")["KMPSearch"];
const levenshteinDistanceAlgorithm = require("../controller/searchSimilarWordController")["levenshteinDistance"];
const findSimilarWordsWithRegex = require("../controller/searchSimilarWordController")["getSimilarWordsWithRegex"]; 

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

        res.json({
            status: "Success",
            courseAdded: course
        });
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error: err.message
        });
    }
};

let updateCourse = async (req, res) => {
    try {
        let courseUpdated = await Course.findOneAndUpdate({ courseCode: req.params.courseCode }, req.body);
        return res.status(200).json({
            status: "Success",
            message: courseUpdated
        });
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error: err.message
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
            message: courses,
            page: page,
            pageSize: pageSize
        })
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error: err.message
        });
    }

}

let getCourse = async (req, res) => {
    try {

        let page = req.query.page ? req.query.page : 1;
        let pageSize = req.query.pageSize ? req.query.pageSize : 5;
        let skippedDocs = ((page - 1) * pageSize);
        let courseName = req.params.courseName;

        let allCourses = await Course.find().select({}).exec();
        let foundCourses = [];

        foundCourses.push(...usingKMPSearchAlgorithm(allCourses, courseName));
        if(foundCourses.length == 0)
            foundCourses.push(...usingLevenshteinDistanceAlgorithm(allCourses, courseName));

        if(foundCourses.length == 0)
            await findSimilarWordsWithRegex(foundCourses, courseName);

        let statusCode = foundCourses.length <= 0 || foundCourses[0].length <= 0 ? 404 : 200;
        let status = foundCourses.length <= 0 || foundCourses[0].length <= 0 ? "Failed" : "Success"

        return res.status(statusCode).json({
            status: status,
            message: foundCourses.length <= 0 || foundCourses[0].length <= 0 ? "Nothing Found With This Name Try to Change your search" : foundCourses
        })
    }
    catch (err) {
        return res.status(400).json({
            status: "Failed",
            error: err.message
        });
    }

}

function deleteAttributeFromArrayOfObject(mappingCounterOfLetterWithWord, attribute) {
    mappingCounterOfLetterWithWord.forEach(Object => {
        delete Object[attribute];
    })
}

function sortArrayOfObject(arrOfObject, attribute, typeOfSort) {
    typeOfSort == "desc" ? 
    arrOfObject.sort((a, b) => {
        return (a[attribute] - b[attribute]);
    }) : arrOfObject.sort((a, b) => {
        return (b[attribute] - a[attribute]);
    }) 
    
}

function usingLevenshteinDistanceAlgorithm(allCourses, courseName){
    let piroityOfEachCourse = [];
    for(let i = 0 ; i < allCourses.length; i++){
        let course = allCourses[i].course;
        if(course.length > courseName.length){
            let difference = course.length;
            let minDiff = courseName.length;
            let splitNum = courseName.length;
            let itertationStops = false; 
            for(let j = 0 ; j < course.length&& !itertationStops ; j++){
                let substringCourse = course.toLowerCase().substring(j, splitNum); 

                if(substringCourse.charAt(splitNum-j) == course.charAt(course.length-1))
                    itertationStops = true;
                difference = levenshteinDistanceAlgorithm(substringCourse, courseName.toLowerCase());
                minDiff = difference < minDiff  ? difference : minDiff;
                
                splitNum ++;
            }
            piroityOfEachCourse.push({"difference":minDiff,  "courseName":allCourses[i]});
        }
        else{
            piroityOfEachCourse.push({"difference":levenshteinDistanceAlgorithm(course.toLowerCase(), courseName.toLowerCase()), "courseName":allCourses[i]});
        }
    }
    sortArrayOfObject(piroityOfEachCourse, "difference", "desc");
    console.log(piroityOfEachCourse);
    deleteAttributeFromArrayOfObject(piroityOfEachCourse, "difference");
    let courses = [];
    piroityOfEachCourse.forEach((element)=>{
        courses.push(element.courseName);
    })
    return courses.splice(0, 2);
}

function usingKMPSearchAlgorithm(allCourses, courseName) {
    let foundCourses = [];
    let counterOfLetter = [];
    for (let i = 0; i < allCourses.length; i++) {
        counterOfLetter[i] = 0;
        if ((KMPSearch(allCourses[i].course.toLowerCase(), courseName.toLowerCase()) != -1)) {
            foundCourses.push(allCourses[i])
        }
    }
    return foundCourses
}



module.exports = { addCourse, updateCourse, getAllCourses, getCourse };