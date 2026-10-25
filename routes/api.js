const express = require("express");

const router = express.Router();

const users = require("./users");
const student = require("./student");
const faculty = require("./faculty");
const subjects = require("./subjects");
const marks = require("./marks");
const attendance = require("./attendance");
const result = require("./result");
const todo = require("./todo");

router.use("/users", users);
router.use("/students", student);
router.use("/faculty", faculty);
router.use("/subjects", subjects);
router.use("/marks", marks);
router.use("/attendance", attendance);
router.use("/results", result);
router.use("/todos", todo);

module.exports = router;