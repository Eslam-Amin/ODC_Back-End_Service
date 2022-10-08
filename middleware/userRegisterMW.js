const validator = require("../util/userRegisterValidator");

module.exports = (req, res, next) => {
    //console.log(req.body);
    let valid = validator(req.body);
    if (valid) {
        next();
    }
    else {
        return res.status(403).json({
            status: "Failed",
            message:validator.errors[0].message
        });
    }
}