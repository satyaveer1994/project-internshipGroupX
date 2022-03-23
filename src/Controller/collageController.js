const CollegeModel = require("../Modle/collegeModel");

const InternModel = require("../Modle/internModel");

const createCollege = async function (req, res) {
  try {
    let college = req.body;

    if (Object.keys(college).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter your college details" });

    let name = college.name;
    duplicateCollege = await CollegeModel.findOne({ name });
    if (duplicateCollege)
      return res
        .status(400)
        .send({ status: false, message: "Name of college already exists" });

    if (!college.name)
      return res
        .status(400)
        .send({ status: false, message: "Please input college name" });
    if (!college.fullName)
      return res
        .status(400)
        .send({ status: false, message: "Please input full name of college" });
    if (!college.logoLink)
      return res
        .status(400)
        .send({
          status: false,
          message: "Please input the logoLink of your college.",
        });

    college.name = college.name.toLowerCase().trim();
    college.fullName = college.fullName.trim();
    college.logoLink = college.logoLink.trim();

    let collegeData = await CollegeModel.create(college);
    return res.status(201).send({ status: true, data: collegeData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getcollegeDetails = async function (req, res) {
  try {
    let data = req.query.collegeName;

    if (!data)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter your college name" });

    req.query.collegeName = req.query.collegeName.toLowerCase().trim();

    let college = await CollegeModel.findOne({
      name: data,
      isDeleted: false,
    }).select({
      isDeleted: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!college)
      return res
        .status(404)
        .send({ status: false, message: "No such college exists" });

    let internData = await InternModel.find({
      collegeId: college._id,
      isDeleted: false,
    }).select({
      _id: 1,
      email: 1,
      mobile: 1,
      name: 1,
    });
    /*While using spread operator to copy the object in college variable,a lot of garbage values were being printed.
    Also I was not able to directly manipulate the college object which we got by using findOne on mongoDB documents. Therefore,
    I used the syntax for deep copy.*/
    let college1 = JSON.parse(JSON.stringify(college)); //deep copy syntax to copy the mongodb object in college variable.
    // let interns1 = JSON.parse(JSON.stringify(internData))
    delete college1._id;
    college1.interns = [...internData]; //added a new key-value pair in college1 object
    // let object=Object.assign(college,{interns:internData})
    return res.status(200).send({ status: true, data: college1 });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.createCollege = createCollege;
module.exports.getcollegeDetails = getcollegeDetails;
