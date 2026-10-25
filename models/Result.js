const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    totalMarks: {
        type: Number,
        required: true
    },

    percentage: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Result", resultSchema);