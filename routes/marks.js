const express = require("express");
const router = express.Router();

const Marks = require("../models/Marks");

router.get("/", async (req, res) => {
    try {
        const marks = await Marks.find();
        res.json(marks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const marks = new Marks(req.body);
        const savedMarks = await marks.save();

        res.status(201).json(savedMarks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;