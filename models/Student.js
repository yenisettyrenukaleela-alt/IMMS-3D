const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        rollNumber: {
            type: String,
            required: true,
            trim: true
        },

        branch: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: String,
            required: true
        },

        year: {
            type: String,
            required: true
        },

        attendance: {
            type: Number,
            default: 0
        },

        marks: {
            type: Number,
            default: 0
        },

        grade: {
            type: String,
            default: "N/A"
        },

        status: {
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);