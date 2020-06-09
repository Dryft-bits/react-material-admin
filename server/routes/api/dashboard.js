const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
// TODO: Include admin middleware here
const TimeTable = require("../../models/TimeTable");
const Login = require("../../models/Login");
const Student = require("../../models/Student");
const Hel = require("../../models/Hel");

const mscBranches = ["BIO", "CHEM", "ECO", "MATH", "PHY"];

router.get("/", [], async (req, res) => {
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
    let timetablesCreated = await TimeTable.find({}, "date").populate(
      "ownerId",
      "-_id branch year"
    );
    timetablesCreated = timetablesCreated.map(function (tt) {
      // null check
      if (tt.ownerId) {
        let branches = tt.ownerId.branch;

        if (branches.length == 2) {
          if (mscBranches.includes(branches[0])) {
            tt.ownerId.branch = branches[0];
          } else if (mscBranches.includes(branches[1])) {
            tt.ownerId.branch = branches[1];
          } else {
            tt.ownerId.branch = branches[0];
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

router.post("/resetSem", [], async (req, res) => {
  try {
    resetStudentCourseStats();
    // mongoose.connection.db.dropCollection("timetables", function (err, result) {
    //   console.log("Timetables dropped");
    // });
    // mongoose.connection.db.dropCollection("hels-prevsems", function (
    //   err,
    //   result
    // ) {
    //   console.log("Hels dropped");
    // });
    // mongoose.connection.db.dropCollection("course-stats", function (
    //   err,
    //   result
    // ) {
    //   console.log("Course dropped");
    // });
    res.status(200).json({ msg: "Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const resetStudentCourseStats = async () => {
  await Student.updateMany(
    { name: "Vikramjeet Das" },
    { submittedForm: false, interestedCourses: [] },
    { multi: true }
  );
};

module.exports = router;
