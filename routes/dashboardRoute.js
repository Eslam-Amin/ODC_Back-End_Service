const express = require("express");
const router = express.Router();
const getAllDataInDash = require("../controller/dashboardController")["getAllDataInDash"];
const auth = require("../middleware/authMWPermission");
const updateFund = require("../controller/dashboardController")["updateFund"];
const updatePaid = require("../controller/dashboardController")["updatePaid"];
const getCoursesData = require("../controller/dashboardController")["getCoursesData"];

router.use(express.json({
    extended: true
}));
//to use body object properly
router.use(express.urlencoded({
    extended: true
}));


router.get("/", auth, getAllDataInDash);
router.get("/:status", auth, getCoursesData);
router.put("/updateFund/" ,auth, updateFund);
router.put("/updatePaid/" ,auth ,updatePaid)




module.exports = router;