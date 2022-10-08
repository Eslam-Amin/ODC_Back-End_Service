const Studnet = require("../models/studentModel");



let addNewStudent = async (req, res) => {
    const found = await Studnet.findOne({
        email: req.body.email
    }).exec()
    if (found)
        return res.status(400).json({
            status: "Failed",
            message: "Email Registered Before!!"
        });
    const student = new Studnet(req.body);
    console.log(student);
    await student.save();
    res.status(200).json({
        status: "Success",
        message: req.body
    });
};
let getAllStudents = async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : 1;
        let pageSize = req.query.pageSize ? req.query.pageSize : 5;
        let skippedDocs = ((page - 1) * pageSize);

        let filterType = req.query.filterType ?req.query.filterType :null;
        let filter = req.query.filter ? req.query.filter:null;
        let sortType = req.query.sortType ? req.query.sortType:null;
        let sortOption = req.query.sortOption ? req.query.sortOption : null;
        if(filter&&filterType){
            if(sortType && sortOption){
                let sortedFilteredStudents = await Studnet.find({[filter]:filterType}).skip(skippedDocs).select({ _id: 0, __v: 0 }).sort({[sortOption]:sortType}).limit(pageSize).exec();
                return res.status(200).json({
                    status: "Success",
                    message: sortedFilteredStudents
                })      
            }
            //let getFilter = filterStudents(filter);
            //var name = req.params.name;
            //var value = req.params.value;
            //let query = {};
            //query[filter] = filterType;
            //let query = `${filter}:'${filterType}'`;
            let filterStudents = await Studnet.find({[filter]:filterType}).skip(skippedDocs).select({ _id: 0, __v: 0 }).limit(pageSize).exec();
            //console.log(query);
            return res.status(200).json({
                status: "Success",
                message: filterStudents
            })      
        }
        else{
            if(sortType && sortOption){
                let query = {[sortOption]:sortType};
                console.log(query);
                let sortedStudents = await Studnet.find({}).skip(skippedDocs).select({ _id: 0, __v: 0 }).sort({[sortOption]:sortType}).limit(pageSize).exec();
                return res.status(200).json({
                    status: "Success",
                    message: sortedStudents
                })      
            }
        }

               let students = await Studnet.find({}).skip(skippedDocs).select({ _id: 0, __v: 0 }).limit(pageSize).exec();
        return res.status(200).json({
            status: "Success",
            message: students
        })
    }
    catch (err) {
        res.status(400).json({
            status: "Failed",
            message: err.message
        });
    }
}


module.exports = {
    addNewStudent, 
    getAllStudents 
};