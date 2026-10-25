const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },

    subjectCode: {
        type: String,
        required: true
    },

    branch: {
        type: String,
        required: true
    },

    semester: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Subject", subjectSchema);