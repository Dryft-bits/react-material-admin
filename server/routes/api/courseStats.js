const express = require("express");
const router = express.Router();
const Student = require("../../models/Student");
const CourseStats = require("../../models/CourseStats");

router.get("/getTotal", [], async (req, res) => {
  try {
    let total = await Student.countDocuments();
    res.status(200).json({
      total: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getSpecific/:code", [], async (req, res) => {
  try {
    const stats = await CourseStats.findOne({
      courseId: req.params.code,
    });
    if (!stats) res.status(200).json({ count: 0 });
    else res.status(200).json({ count: stats.count });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
