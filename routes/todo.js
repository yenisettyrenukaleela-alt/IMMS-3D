const express = require("express");
const router = express.Router();

const Todo = require("../models/Todo");

// GET all todos
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// CREATE todo
router.post("/", async (req, res) => {
    try {
        const todo = new Todo(req.body);
        const savedTodo = await todo.save();

        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);

        res.json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;