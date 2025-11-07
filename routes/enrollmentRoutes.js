const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ✅ Create Student
router.post("/students", async (req, res) => {
  try {
    const s = await Student.create(req.body);
    res.status(201).json({ success: true, student: s });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ Create Course
router.post("/courses", async (req, res) => {
  try {
    const c = await Course.create(req.body);
    res.status(201).json({ success: true, course: c });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ Enroll Student in Course
router.post("/enroll", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const enrollment = await Enrollment.create({ student: studentId, course: courseId });
    res.status(201).json({ success: true, enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ Get courses for a student
router.get("/student/:id/courses", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.id }).populate("course");
    const courses = enrollments.map(e => e.course);
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get students for a course
router.get("/course/:id/students", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.id }).populate("student");
    const students = enrollments.map(e => e.student);
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Withdraw
router.delete("/withdraw", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const result = await Enrollment.findOneAndDelete({ student: studentId, course: courseId });
    if (!result) return res.status(404).json({ success: false, message: "Enrollment not found" });
    res.json({ success: true, message: "Withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
