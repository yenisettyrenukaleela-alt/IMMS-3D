const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    marks: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Marks", marksSchema);