const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const TimeTable = require("../../models/TimeTable");
const Login = require("../../models/Login");
const Student = require("../../models/Student");
const { check, validationResult } = require("express-validator");
const mscBranches = ["BIO", "CHEM", "ECO", "MATH", "PHY"];
const jwt = require('jsonwebtoken');
router.get("/", [], async (_req, res) => {
  try {
    let nLogins = await Login.countDocuments();
    let userLogins = await Login.find({}, "-__v").populate(
      "userId",
      "branch year"
    );
    userLogins = userLogins.map(function (login) {
      // null check
      if (login.userId) {
        let branches = login.userId.branch;

        if (branches.length == 2) {
          if (mscBranches.includes(branches[0])) {
            login.userId.branch = branches[0];
          } else if (mscBranches.includes(branches[1])) {
            login.userId.branch = branches[1];
          } else {
            login.userId.branch = branches[0];
          }
        }
      }
      return login;
    });

    let nUniqueLogins = (await Login.find().distinct("userId")).length;
    let timetablesCreated = await TimeTable.find({}, "date branch year");
    timetablesCreated = timetablesCreated.map(function (tt) {
      // null check
      if (tt.ownerId) {
        let branches = tt.branch;

        if (branches.length == 2) {
          if (mscBranches.includes(branches[0])) {
            tt.branch = branches[0];
          } else if (mscBranches.includes(branches[1])) {
            tt.branch = branches[1];
          } else {
            tt.branch = branches[0];
          }
        }
      }
      return tt;
    });

    res.status(200).json({
      nLogins: nLogins,
      nUniqueLogin: nUniqueLogins,
      userLogins: userLogins,
      timetablesCreated: timetablesCreated
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/resetSem", [check('token', "token is required").not().isEmpty(),], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(412).json({ errors: errors.array() }); //412: precondition failed
  }
  const token = req.body.token;
  jwt.verify(token, process.env.SECRET_KEY_BCRYPT, (err, data) => {
    if (err) {
      return res.json(null);
    }
    else if (data.isAdmin == true) {
        try {
          const sem = req.body.semester;
          resetStudentCourseStats(sem);
          mongoose.connection.db.dropCollection("timetables", function (
            _err,
            _result
          ) {
            console.log("Timetables dropped");
          });
          mongoose.connection.db.dropCollection("hels-prevsems", function (
            _err,
            _result
          ) {
            console.log("Hels dropped");
          });
          mongoose.connection.db.dropCollection("course-stats", function (
            _err,
            _result
          ) {
            console.log("Course dropped");
          });
          res.status(200).json({ msg: "Deleted" });
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server error");
        }
      }
    else
    {
      res.status(403).send("Not authorized");
    }
    })
});

const resetStudentCourseStats = async sem => {
  await Student.updateMany(
    {},
    { submittedForm: false, interestedCourses: [] },
    { multi: true }
  );
  if (sem === "odd") {
    await Student.updateMany({}, { $inc: { year: 1 } }, { multi: true });
  }
};

module.exports = router;
