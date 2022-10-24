const bcrypt = require("bcrypt");
const User = require("../models/adminModel");
const config = require("config");
const nodeMailer = require("nodemailer");
const OTPVerification = require("../models/userOTPVerification");
const { has } = require("config");



let register = async (req, res) => {
    try {
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
            password: hashedPassword,
            verified:false
        });
        //console.log(user);

        //console.log(config.get("jwtsec"));
        //checks if the token is created or not
        if (!config.get("jwtsec")) {
            return res.status(500).json({status:"Failed",
            message:"Request Can't Be Fullfilled token is not defined"
        });
        }
        user.save()
        .then((result)=>{
            sendOTPVerification(result, res);
        });
        
        const token = user.genAuthToken();
        //console.log("this is the ",token);
        //setting Header.
        //x refers to a custom header.
        res.header("x-auth-token", token);

/*  
        res.status(200).json({
            status:"success",
            message:user
        });*/

    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({
            status:"Failed",
            message:err.message
        });
    }





}
let nodemailer = nodeMailer.createTransport({
    host:"smtp-mail.outlook.com",
    auth:{
        user:"ea.eslamamin@outlook.com",
        pass:"eca just 1"
    }
})

const sendOTPVerification = async ({_id, email}, res)=>{
    try{
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from:"ea.eslamamin@outlook.com",
            to:email,
            subject:"Verify your email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the register<br><b>This EXPIRES in one HOUR!!</b>.</p>`
        };

        //hash the otp 
        const saltRounds = 10;      
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        console.log(hashedOTP);
        const newOTPVerification =  new OTPVerification({
            userId:_id,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiresAt: Date.now()+ 3600000
        })
        await newOTPVerification.save();
        await nodemailer.sendMail(mailOptions);
        res.json({
            status:"Pending",
            message:"Verification otp mail sent",
            data:{
                userId : _id,
                email,
            }
        })
    }catch(err){
        res.json({
            status:"Failed",
            message:err.message
        });
    }

}

const verifyOTP = async (req, res)=>{
    try{
        let {userId, otp} = req.body;
        console.log(userId, otp)
        if(!userId || !otp){
            throw Error("Empty OTP Details are not allowed");
        }
        else{
            let userVerfication = await OTPVerification.find({
                userId
            });
            console.log("this is the user verification ",userVerfication)
            if(userVerfication.length <=0 ){
                //no record found
                throw new Error("Account Doesn't Exist or hass been verified already, please up or login")
            }
            else{
                const { expiresAt } = userVerfication[0].expiresAt;
                const hashedOTP = userVerfication[0].otp;
                if(expiresAt < Date.now()){
                    await OTPVerification.deleteMany({
                        userId
                    })
                    throw new Error("OTP Has Expired, Please Request Again")
                }
                else{
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if(!validOTP){
                        throw new Error("Invalid OTP, check Your inbox");
                    }
                    else{
                        await User.updateOne({_id:userId},{verified:true});
                        await OTPVerification.deleteMany({userId});
                        
                        res.status(200).json({
                            status:"Verified",
                            message:`Email has beed Verified`
                        })
                    }
                }
            }
        }
    }
    catch(err){
        res.status(200).json({
            status:"Failed",
            message:err.message
        })
    }
} 



module.exports = {register, verifyOTP};