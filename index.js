const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes/api");

require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

// MongoDB connection
mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });

mongoose.Promise = global.Promise;

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// JSON body
app.use(bodyParser.json());

// API routes
app.use("/api", routes);

// Simple error handler
app.use((err, req, res, next) => {
    console.error("API Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// React frontend
app.use(
    express.static(
        path.join(__dirname, "client", "dist")
    )
);

// React fallback
app.get("*", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "client",
            "dist",
            "index.html"
        )
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});