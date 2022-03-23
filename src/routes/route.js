const express = require("express");
const router = express.Router();

const CollageController = require("../Controller/collageController")
const InternController = require("../Controller/internController")

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});




router.post("/colleges",CollageController.createCollege)

router.post("/interns",InternController.createInternDocument)

router.get("/collegeDetails",CollageController.getcollegeDetails)

module.exports = router;
