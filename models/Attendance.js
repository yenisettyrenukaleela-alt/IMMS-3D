const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
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

    totalClasses: {
        type: Number,
        required: true
    },

    attendedClasses: {
        type: Number,
        required: true
    },

    percentage: {
        type: Number
    }
});

module.exports = mongoose.model("Attendance", attendanceSchema);