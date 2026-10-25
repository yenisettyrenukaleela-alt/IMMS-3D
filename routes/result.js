const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

router.get("/", async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const result = new Result(req.body);
        const savedResult = await result.save();

        res.status(201).json(savedResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;