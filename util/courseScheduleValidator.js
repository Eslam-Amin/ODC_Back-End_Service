const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    "type":"object",
    "properties":{
        "courseName":{
            "type":"string"
        },
        "courseId":{
            "type":"string"
        },
        "courseCode":{
            "type":"string"
        },
        "startDate":{
            "type":"string"
            //"format":"date-time"
        },
        "endDate":{
            "type":"string"
            //"format":"date-time"
        },
        "place":{
            "type":"string"
        },
        "instructor":{
            "type":"string"
        },
        "numOfStudents":{
            "type":"number"
        },
        "maxNumOfStudents":{
            "type":"number"
        },
        "status":{
            "type":"string"
        },
        "avaiablePlaces":{
            "type":"number"
        },
        "sponsor":{
            "type":"string"
        }
    }, 
   "required":["courseName", "startDate", "endDate", "place","instructor", "maxNumOfStudents","sponsor"]
};


let courseValidator = ajv.compile(schema);

module.exports = courseValidator;