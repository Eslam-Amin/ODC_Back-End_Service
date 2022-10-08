const express = require("express");
const router = express.Router();
const validator = require("../middleware/authLoginMW");
const login = require("../controller/loginController");
//const auth = require("../middleware/authMWPermission");

router.post("/", validator, login);




module.exports = router;
