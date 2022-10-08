const express = require("express");
const router = express.Router();
const validator = require("../middleware/courseScheduleMW");
const auth = require("../middleware/authMWPermission");
const createCourse = require("../controller/courseScheduleController")["createCourse"];
const getCourses = require("../controller/courseScheduleController")["getCourses"];
const studentEnrollValidator = require("../middleware/studentEnrollMW");
const courseEnrollment = require("../controller/courseScheduleController")["courseEnrollment"];
const updateCourse = require("../controller/courseScheduleController")["updateCourse"];


router.use(express.json({
    extended: true
}));
//to use body object properly
router.use(express.urlencoded({
    extended: true
}));


router.post("/createCourse/", auth,validator, createCourse);


router.get("/getCourses/", getCourses)

router.post("/courseEnrollment/",studentEnrollValidator, courseEnrollment)
router.put("/updateCourse", updateCourse);



module.exports = router;