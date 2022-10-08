const express = require("express");
const router = express.Router();
const getAllJobs = require("../controller/jobController")["getAllJobs"];
const sendJobRecommendations = require("../controller/jobController")["sendJobRecommendations"];


router.use(express.json({
    extended: true
}));
//to use body object properly
router.use(express.urlencoded({
    extended: true
}));


router.post("/getJobs/", getAllJobs);



router.post("/JobRecommendations/", sendJobRecommendations)


module.exports = router;