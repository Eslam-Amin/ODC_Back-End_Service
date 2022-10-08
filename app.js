const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const ejs = require("ejs");
const ajv = require("ajv");
const userRoute = require("./routes/studentRoute");
const mongoose = require("mongoose");
const registerRoute = require("./routes/registerRoute");
const authRoute = require("./routes/loginRoute");
const studentRoute = require("./routes/studentRoute");
const config = require("config");
const courseDefRoute = require("./routes/courseDefRoute");
const courseScheduleRoute = require("./routes/courseScheduleRoute");
const rejectedStudent = require("./routes/rejectedStudentRoute");
const jobsRoute = require("./routes/jobRoute");
const dashboardRoute = require("./routes/dashboardRoute");


mongoose.connect("mongodb://localhost:27017/ODC_System",{})
.then(()=>{
    console.log("Connection is done");
})
.catch((err)=>{
    console.log(err);
})


app.use(express.json({
    extended: true
}));
//to use body object properly
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/students/", studentRoute);
app.use("/api/register/", registerRoute);
app.use("/api/login/", authRoute);
app.use("/api/courses/", courseDefRoute);
app.use("/api/courses/schedule/",courseScheduleRoute );
app.use("/api/students/rejected/",rejectedStudent );
app.use("/api/jobs/",jobsRoute);
app.use("/api/dashboard", dashboardRoute);

//checks if the token is created or not
if(!config.get("jwtsec")){
    console.log("ERORR HAPPENED");
    process.exit(0);
    //0 indicates the termination of the process isn't a failure
    //
}
console.log(port);
app.listen(port, () => {
    console.log("listening to the port");
});


app.get("*", (req, res, next) => {
    console.log("Redirect in 2secs");
    setTimeout(() => {
        res.redirect("/api");
        next();
    }, 2000);
});