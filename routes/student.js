const express = require("express");
const router = express.Router();

const Student = require("../models/Student");


// ==========================================
// GET ALL STUDENTS
// GET /api/students
// ==========================================

router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({
            createdAt: -1
        });

        res.status(200).json(students);

    } catch (error) {
        console.error("GET students error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
});


// ==========================================
// GET STUDENT BY ID
// GET /api/students/:id
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        console.error("GET student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch student",
            error: error.message
        });
    }
});


// ==========================================
// ADD STUDENT
// POST /api/students
// ==========================================

router.post("/", async (req, res) => {
    try {

        const {
            name,
            email,
            rollNumber,
            branch,
            semester,
            year,
            attendance,
            marks,
            grade,
            status
        } = req.body;


        // Basic validation

        if (
            !name ||
            !email ||
            !rollNumber ||
            !branch ||
            !semester ||
            !year
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required student details"
            });
        }


        // Check duplicate roll number

        const existingStudent =
            await Student.findOne({ rollNumber });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Roll number already exists"
            });
        }


        // Create student

        const student = new Student({
            name,
            email,
            rollNumber,
            branch,
            semester,
            year,
            attendance: attendance || 0,
            marks: marks || 0,
            grade: grade || "N/A",
            status: status || "Pending"
        });


        const savedStudent =
            await student.save();


        res.status(201).json(savedStudent);

    } catch (error) {

        console.error("POST student error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to add student",
            error: error.message
        });
    }
});


// ==========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ==========================================

router.put("/:id", async (req, res) => {
    try {

        const updatedStudent =
            await Student.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json(updatedStudent);

    } catch (error) {

        console.error("PUT student error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to update student",
            error: error.message
        });
    }
});


// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================

router.delete("/:id", async (req, res) => {
    try {

        const deletedStudent =
            await Student.findByIdAndDelete(
                req.params.id
            );

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error("DELETE student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete student",
            error: error.message
        });
    }
});


module.exports = router;