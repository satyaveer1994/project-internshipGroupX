

const validator = require("email-validator");

const InternModel = require("../Modle/internModel")

const CollegeModel = require("../Modle/collegeModel")


const createInternDocument = async function (req, res) {
try{
let data = req.body;

if (Object.keys(data).length == 0)
    return res.status(400).send({ status: false, message: "Please Enter intern details" });
////////////////////////////////////////////////////////////////////////////////////////////////////////
let internName=data.name;
if(!internName)
    return res.status(400).send({ status: false, message: "Please Enter Name" });

    data.name = (data.name).trim();
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let email = data.email;
if (!email)
    return res.status(400).send({ status: false, message: "Please Enter Email" });

    data.email = (data.email).trim();

if (validator.validate(email.trim()) == false) {
    return res.status(400).send({ status: false, message: "Please input a valid email" });
}

let duplicateEmail = await InternModel.findOne({ email });
    if (duplicateEmail) {
    return res.status(400).send({ status: false, message: "Email is already in use" });
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
data.mobile = (data.mobile).trim();

let mobile = data.mobile;
if (!mobile) return res.status(400).send({ status: false, message: "Please Enter Mobile Number" });
function checkIndianNumber(b)   
{  
var a = /^[6-9]\d{9}$/gi;  
  // var a=/^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}9[0-9](\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/gi;
    if (a.test(b))   
    {  
        return true;  
    }   
    else   
    {  
        return false; 
    }  
};
let mobileCheck = checkIndianNumber(mobile);
if(mobileCheck==false) return res.status(400).send({status:false, message:"Please enter a valid mobile number"})

let duplicateNumber = await InternModel.findOne({ mobile });
if (duplicateNumber) {
    return res.status(400).send({ status: false, message: "Mobile Number is already in use" });
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

let college = data.collegeName;
if (!college) return res.status(400).send({ status: false, message: "Please Enter college Name" });

data.collegeName = (data.collegeName).toLowerCase().trim();

let checkCollege = await CollegeModel.findOne({ name: college, isDeleted:false }).select({
    _id: 1,
});

if (!checkCollege)
    return res.status(404).send({ status: false, message: "No such college exists" });


delete data.collegeName;

data.collegeId = checkCollege._id;

let internData = await InternModel.create(data);

return res.status(201).send({ status: true, data: internData });
}
catch(error)
{
    return res.status(500).send({status:false, error:error.message})
}
};


module.exports.createInternDocument = createInternDocument;