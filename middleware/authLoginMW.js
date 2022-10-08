const validator = require("../util/userLoginValidator");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    try{
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(401).json({
        status:"DENIED",
        message:"Access DENIED, TOKEN must Be PROVIDED"
    });
    //const decodedPayload = jwt.verify(token, config.get("jwtsec"));
    //console.log(decodedPayload);
    const decodedPayload = jwt.verify(token, config.get("jwtsec"));
    if (!decodedPayload.userid)
        return res.status(401).json({
            status:"DENIED",
            message:"Access DENIED, TOKEN is INVALID"
        });
    let valid = validator(req.body);
    //console.log(validator)
    //console.log("req body in MWV ", req.body);
    if (valid) {
        next();
    }
    else
        return res.status(400).json({
            status: "Failed",
            message:validator.errors[0].message
        });
    }
    catch(err){
        return res.status(400).json({
            status:"DENIED",
            message:err.message,
            //errorMessage:err.message
        });
    }
}