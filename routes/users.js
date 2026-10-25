const express = require("express");
const router = express.Router();

const Users = require("../models/Users");

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// GET user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// CREATE user
router.post("/", async (req, res) => {
    try {
        const user = new Users(req.body);
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);

        res.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;