const bcrypt = require("bcrypt");
const User = require("../models/adminModel");
const config = require("config");



let login = async (req, res) => {

    let user = await User.findOne({
        email: req.body.email
    }).exec();
    if (!user)
        return res.status(400).json({
            status: "Failed",
            message: "Invalid EMAIL or PASSWORD!!!"
        });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    //console.log(validPassword);
    if (!validPassword)
        return res.status(400).json({
            status: "Failed",
            message: "Invalid EMAIL or PASSWORD!!!"
        });
    //checks if the token is created or not
    if (!config.get("jwtsec")) {
        return res.status(500).json({
            status: "Failed",
            message: "Request Can't Be Fullfilled token is not defined"
        });
    }

    //const token = user.genAuthToken();

    //console.log(token);
    //setting Header.
    //x refers to a custom header.
    //res.header("x-auth-token", token);



    res.status(200).json({
        status: "Success",
        message: "Login Successful"
    });
}



module.exports = login;