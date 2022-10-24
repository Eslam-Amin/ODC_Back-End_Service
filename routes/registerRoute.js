const express = require("express");
const router = express.Router();
const validator = require("../middleware/userRegisterMW");
const register = require("../controller/registerController")["register"];
const auth = require("../middleware/authMWPermission");
const verifyOTP = require("../controller/registerController")["verifyOTP"];


router.use(express.json({
    extended: true
}));

router.use(express.urlencoded({
    extended: true
}));

router.post("/",auth ,validator, register);
router.post("/verifyOTP/",verifyOTP);

module.exports = router;



