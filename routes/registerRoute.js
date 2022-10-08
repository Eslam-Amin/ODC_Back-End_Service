const express = require("express");
const router = express.Router();
const validator = require("../middleware/userRegisterMW");
const register = require("../controller/registerController");
const auth = require("../middleware/authMWPermission");

router.use(express.json({
    extended: true
}));

router.use(express.urlencoded({
    extended: true
}));

router.post("/",auth ,validator, register);

module.exports = router;



