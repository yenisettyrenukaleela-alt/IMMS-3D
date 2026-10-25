const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");

router.get("/", async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const attendance = new Attendance(req.body);
        const savedAttendance = await attendance.save();

        res.status(201).json(savedAttendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;