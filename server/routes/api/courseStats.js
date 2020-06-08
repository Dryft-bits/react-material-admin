const express = require("express");
const router = express.Router();
const Student = require("../../models/Student");
const CourseStats = require("../../models/CourseStats");

router.get("/:code", [], async (req, res) => {
  try {
    let total = await Student.countDocuments();
    let stats = await CourseStats.findOne({
      courseId: req.params.code,
    });
    let no = 0;
    if (stats) no = stats.count;
    res.status(200).json({
      count: stats.count,
      total: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
