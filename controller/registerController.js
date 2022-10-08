const bcrypt = require("bcrypt");
const User = require("../models/adminModel");
const config = require("config");


let register = async (req, res) => {
    try {
        /*
        const token = res.header("x-auth-token");
        if(!token)
            res.status(401).send("ACCESS DENIED");
            */

        let user = await User.findOne({
            email: req.body.email
        }).exec()
        if (user)
            return res.status(400).json({
                status:"Failed",
                message:"Email Already Registered"
            });
        let salt = 10;
        let hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword
        });
        //console.log(user);

        //console.log(config.get("jwtsec"));
        //checks if the token is created or not
        if (!config.get("jwtsec")) {
            return res.status(500).json({status:"Failed",
            message:"Request Can't Be Fullfilled token is not defined"
        });
        }
        await user.save();
        
        const token = user.genAuthToken();
        console.log(token);
        //setting Header.
        //x refers to a custom header.
        res.header("x-auth-token", token);


        res.status(200).json({
            status:"success",
            message:user
        });

    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({
            status:"Failed",
            message:err.message
        });
    }





}


module.exports = register;