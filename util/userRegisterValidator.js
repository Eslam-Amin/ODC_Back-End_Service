const Ajv = require("ajv").default
const ajv = new Ajv();

const schema = {
    "type":"object",
    "properties":{
        "name":{
            "type":"string",
            "pattern":"^[A-Z]\\w*\\s*\\w*$"
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "password":{
            "type":"string",
            "pattern":"^[A-Za-z]\\w{7,14}$"
           
            /*
             [7 to 16 characters which contain only characters,
                 numeric digits,
                 underscore and first character must be a letter]*/
        },
        "verified":{
            "type":"boolean"
        }
    },
    "required":["name", "email", "password"]
}

let userValidator = ajv.compile(schema);

module.exports = userValidator;