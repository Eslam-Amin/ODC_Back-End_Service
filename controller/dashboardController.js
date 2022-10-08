const Sponsor = require("../models/sponsorModel");
const CourseDef = require("../models/courseDefModel");
const CourseSchedule = require("../models/courseScheduleModel");



let getAllDataInDash = async (req, res)=>{
    let sponsors = await Sponsor.find({}).exec(); 
    let coursesDef = await CourseDef.find({}).exec();
    let courseSchedule = await CourseSchedule.find({}).exec();
    let numberOfCoursesInSchedule = await CourseSchedule.countDocuments({});
    res.status(200).json({
        status:"Success",
        message:{
            "sponsors":sponsors,
            "courseDef":coursesDef,
            "courseSchedule":courseSchedule,
            "numberOfCoursesInSchedule":numberOfCoursesInSchedule
        }
    });
    //res.send(sponsors);
}
let updateFund = async(req, res)=>{
    try{
    let updatedFund = req.body.newFund ? req.body.newFund:null;
    let sponsor = req.query.sponsor ? req.query.sponsor : null;
    if(!sponsor)
        throw new Error("Sponsor Is required");
    if(!updatedFund)
        throw new Error("New Fund Is required");
    let foundSponsor = await Sponsor.findOne({sponsorName:sponsor.toLowerCase()}).exec()
    if(foundSponsor){
        let newFund = foundSponsor.fund+ req.body.newFund;
        //let fund = foundSponsor.fund+updateFund;
        //console.log(fund,foundSponsor.fund);       
        //req.body.fund = fund; 
        await Sponsor.findOneAndUpdate({sponsorName:sponsor.toLowerCase()}, {"fund":newFund});
        let updatedSponsor = await Sponsor.findOne({sponsorName:sponsor.toLowerCase()}).exec();
        res.status(200).json({
            status:"Success",
            message:updatedSponsor
        })
    }
    else
        throw new Error("Sponsor isn't found");
        

        
    
    }
    catch(err){
        res.status(400).json({
            status:"Failed",
            message : err.message
        })
    }
}


let updatePaid = async (req, res)=>{
    try{
        let updatedPaid = req.body.newPaid ? req.body.newPaid:null;
        let sponsor = req.query.sponsor ? req.query.sponsor : null;
        if(!sponsor)
            throw new Error("Sponsor Is required");
        if(!updatedPaid)
            throw new Error("New Paid Is required");
        let foundSponsor = await Sponsor.findOne({sponsorName:sponsor.toLowerCase()}).exec()
        if(foundSponsor){
            let validPaid = updatedPaid > foundSponsor.paid;
            let validPaidOnFund =  updatedPaid < foundSponsor.fund;
            console.log(validPaid, validPaidOnFund);
            if(!validPaid || !validPaidOnFund)
                throw new Error("Paid Is INVALID!!");
            //let newFund = foundSponsor.fund+ req.body.newFund;
            //let fund = foundSponsor.fund+updateFund;
            //console.log(fund,foundSponsor.fund);       
            //req.body.fund = fund; 
            await Sponsor.findOneAndUpdate({sponsorName:sponsor.toLowerCase()}, {"paid":updatedPaid});
            let updatedSponsor = await Sponsor.findOne({sponsorName:sponsor.toLowerCase()}).exec();
            res.status(200).json({
                status:"Success",
                message:updatedSponsor
            })
        }
        else
            throw new Error("Sponsor isn't found");
            
    
            
        
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message : err.message
        })
    }
};



let getCoursesData = async(req, res)=>{
    console.log(req.params.status)
    let courses = await CourseSchedule.find({status:req.params.status}).exec();    
    res.status(200).json({
        status:"Success",
        message:courses
    })
}


module.exports = {
    getAllDataInDash,
    updateFund,
    updatePaid,
    getCoursesData
};