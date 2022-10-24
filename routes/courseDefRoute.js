const express = require("express");
const router = express.Router();
const validator = require("../middleware/courseDefMW");
const auth = require("../middleware/authMWPermission");
const addCourse = require("../controller/courseDefController")["addCourse"];
const updateCourse = require("../controller/courseDefController")["updateCourse"];
const getCourses = require("../controller/courseDefController")["getAllCourses"];
const getCourse = require("../controller/courseDefController")["getCourse"];


router.use(express.json({
    extended: true
}));
//to use body object properly
router.use(express.urlencoded({
    extended: true
}));

router.post("/definition/addCourse", auth, validator, addCourse)

router.put("/definition/updateCourse/:courseCode", auth,updateCourse);

router.get("/definition/getCourses", auth, getCourses);

router.get("/definition/getCourses/:courseName", auth, getCourse);


module.exports = router;