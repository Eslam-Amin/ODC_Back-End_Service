const validator = require("../util/courseDefValidator");

module.exports = (req, res, next)=>{
    let valid = validator(req.body);
   
    if(!valid)
        return res.status(400).json({
            status:"Failed",
            message:validator.errors[0].message
        });
    next();
}