const mongoose = require("mongoose");
const valid = require("validator");
const jwt = require("jsonwebtoken");
const config = require("config");
//2) create user schema

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:(val)=>{return valid.isEmail(val);},
            message:'{VALUE} is not valid email'   
        },
    },
    isAdmin:{
        type:Boolean
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
});

userSchema.method("genAuthToken", function(){
    const token = jwt.sign({
        //payload
        userid: this._id,
        adminRole: this.isAdmin
    }, config.get("jwtsec"));
    return token;
});

//3) create model

const User = mongoose.model("User", userSchema);
module.exports = User