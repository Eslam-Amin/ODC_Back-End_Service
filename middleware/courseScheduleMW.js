const validator = require("../util/courseScheduleValidator");

module.exports = (req, res, next)=>{
    //console.log("courseScheduleMW, ",req.body);
    let valid = validator(req.body);
    //console.log(validator);
    if(!valid)
        return res.status(400).json({
            status:"Failed",
            message:validator.errors[0].message
        });
    next();
}