const Ajv = require("ajv");
const ajv = new Ajv();


const schema = {
    "type":"object",
    "properties":{
        "name":{
            "type":"string",
            "pattern":"^[A-Z]\\w*\\s*\\w*$"
        },
        "age":{
            "type":"number"
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "gender":{
            "type":"string",
            "enum":["male","female"]
        },
        "badgeId":{
            "type":"array",
            "items":[
                {
                    "type":"string"
                }
            ]
        },
        "testResult":{
            "type":"number"
        }
    },
    "required":["name", "age", "email", "badgeId", "testResult"]
}

let userValidator = ajv.compile(schema);

module.exports = userValidator;