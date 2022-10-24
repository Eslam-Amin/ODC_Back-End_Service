const Course = require("../models/courseDefModel");
const KMPSearch = require("../controller/searchSimilarWordController")["KMPSearch"];
const getSimilarWordsWithMyAlgorithm = require("../controller/searchSimilarWordController")["getSimilarWordsWithMyAlgorithm"];

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
            message: updateCourse
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

        let mappingCounterOfLetterWithWord = [];

        [foundCourses, mappingCounterOfLetterWithWord] = usingKMPSearchAlgorithm(allCourses, courseName);
        let sortedArrOfMapping = getSortedArr(mappingCounterOfLetterWithWord);
        deleteAttributeFromArrayOfObject(mappingCounterOfLetterWithWord);
        //console.log("test Im here");

        foundCourses.length > 0 ?
            foundCourses.concat(checkForSimilarDuplicates(foundCourses, sortedArrOfMapping)) : foundCourses.concat(addFrequentElements(foundCourses, sortedArrOfMapping));

        if (foundCourses.length != 0) {
            await findSimilarWordsWithRegex(foundCourses, courseName);
        }
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

function deleteAttributeFromArrayOfObject(mappingCounterOfLetterWithWord) {
    mappingCounterOfLetterWithWord.forEach(Object => {
        delete Object.counterOfLetter;
    })
}

function sortArrayOfObject(arrOfObject) {
    arrOfObject.sort((a, b) => {
        return (b.counterOfLetter - a.counterOfLetter);
    })
}

function usingKMPSearchAlgorithm(allCourses, courseName) {
    let foundCourses = [];
    let counterOfLetter = [];
    let arrOfMapping = []
    for (let i = 0; i < allCourses.length; i++) {
        counterOfLetter[i] = 0;
        if ((KMPSearch(allCourses[i].course.toLowerCase(), courseName.toLowerCase()) != -1)) {
            foundCourses.push(allCourses[i])
        }
        arrOfMapping.push(getSimilarWordsWithMyAlgorithm(allCourses, courseName, i));
    }
    return [foundCourses, arrOfMapping]
}

function getSortedArr(mappingCounterOfLetterWithWord) {
    let sortedArr = [];
    sortArrayOfObject(mappingCounterOfLetterWithWord);
    mappingCounterOfLetterWithWord.forEach((element) => {
        sortedArr.push(element);
    })

    return sortedArr;
}

function checkForSimilarDuplicates(foundCourses, sortedArrOfMapping) {
    for (let i = 0; i < 2; i++) {
        if (foundCourses[0].course != sortedArrOfMapping[i].course) {
            foundCourses.push(sortedArrOfMapping[i].course);
        }
    }
}

function addFrequentElements(foundCourses, sortedArrOfMapping) {
    foundCourses.push(sortedArrOfMapping[0])
    foundCourses.push(sortedArrOfMapping[1])
}

async function findSimilarWordsWithRegex(foundCourses, courseName) {
    let firstLetterOfCourseName = courseName[0];
    let anotherLetterOfCourseName = courseName[Math.floor(courseName.length / 2)];
    let lastLetterOfCourseName = courseName[courseName.length - 1];
    let regexStatement = courseName.length > 2 ? `(^(?=[a-zA-Z]*))(${firstLetterOfCourseName}\\w*${anotherLetterOfCourseName}\\w*${lastLetterOfCourseName})` : `(^(?=[a-zA-Z]*))(${firstLetterOfCourseName}.*)`

    let regex = new RegExp(regexStatement, 'i');
    let course = await Course.find({ course: { $regex: regex } }).exec();
    let courseFound = false;
    if (course.length > 0) {
        for (let i = 0; i < foundCourses.length && !courseFound && course.length != 0; i++) {
            if (foundCourses[i].course == (course[0].course)) {
                courseFound = true;
            }
        }
        course.length == 0 ? null : courseFound ? null : foundCourses.concat(course);
    }
}

module.exports = { addCourse, updateCourse, getAllCourses, getCourse };