const Ajv = require("ajv");
const ajv = new Ajv();


const schema = {
    "type":"object",
    "properties":{
        "globalPath":{
            "type":"string"
        },
        "localPath":{
            "type":"string"
        },
        "course":{
            "type":"string"
        },
        "courseCode":{
            "type":"string"
        },
        "skillsCovered":{
            "type":"array",
            "items":[
                {
                    "type":"string"
                }
            ]
        },
        "prerequistes":{
            "type":"array",
            "items":[
                {
                    "type":"string"
                }
            ]
        },
        "badge":{
            "type":"string"
        },
    },
    "required":["globalPath", "localPath", "course", "skillsCovered", "badge"]
};


let courseValidator = ajv.compile(schema);


module.exports = courseValidator;