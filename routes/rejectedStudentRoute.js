const express = require("express");
const router = express.Router();
const getRejected = require("../controller/rejectedStudentController")["getRejected"];
const sendRecommendation = require("../controller/rejectedStudentController")["sendRecommendation"];

//to use body object properly
router.use(express.urlencoded({
    extended: true
}));

router.use(express.json({
    extended: true
}))


router.get("/getRejected/", getRejected);


router.post("/sendRecommendationTo/", sendRecommendation)


module.exports = router;
