const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({
            status:"DENIED",
            message:"Access DENIED, TOKEN must Be PROVIDED"
        });
        const decodedPayload = jwt.verify(token, config.get("jwtsec"));
        if (!decodedPayload.adminRole)
            return res.status(401).json({
                status:"DENIED",
                message:"Access DENIED, TOKEN is INVALID"
            });
        next();
    }
    catch (err) {
        return res.status(400).json({
            status:"DENIED",
            message:err.message,
            //errorMessage:err.message
        });
    }




}