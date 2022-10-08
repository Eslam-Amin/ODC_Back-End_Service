const addNewStudent = require("../controller/studentController")["addNewStudent"]
const getAllStudents = require("../controller/studentController")["getAllStudents"];
const courseEnrollment = require("../controller/studentController")["courseEnrollment"];
const express = require("express");
const validator = require("../middleware/studentMW");
const router = express.Router();



//to use body object properly
router.use(express.urlencoded({
    extended: true
}));

router.use(express.json({
    extended: true
}))

router.post("/addNewStudent/",validator, addNewStudent);

router.get("/getAllStudents/", getAllStudents);



module.exports = router;
