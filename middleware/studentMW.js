const validator = require("../util/studentValidator");

module.exports = (req, res, next) => {
    if(!req.body.badgeId)
        req.body.badgeId = [];
    if(!req.body.testResult)
        req.body.testResult = 0;
    console.log(req.body);
    let valid = validator(req.body);
    if (valid) {
        next();
    }
    else {
        return res.status(400).json({
            status: "Failed",
            message:validator.errors[0].message
        });
    }
}