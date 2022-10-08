const validator = require("../util/studentEnrollValidator");

module.exports = (req, res, next) => {
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