const Ajv = require("ajv");
const ajv = new Ajv();


const schema = {
    "type":"object",
    "properties":{
           "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "courseName":{
            "type":"string"
        }
    },
    "required":["email", "courseName"]
}

let studentEnrollValidator = ajv.compile(schema);

module.exports = studentEnrollValidator;