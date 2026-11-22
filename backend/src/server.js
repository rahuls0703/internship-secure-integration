require("dotenv").config();

const path = require("node:path");
const express = require("express");
const helmet = require("helmet");
const db = require("./database/db");
const rateLimit = require("express-rate-limit");

const internships = require("./routes/internships");
const applications = require("./routes/applications");

const app = express();

// Security middleware
app.use(helmet());

// Request body limits
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

// Request logging middleware
app.use((req, res, next) => {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const duration = Number(
            process.hrtime.bigint() - startTime
        ) / 1e6;

        const logEntry = {
            level: res.statusCode >= 500 ? "error" : "info",
            event: "http_request",
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: Number(duration.toFixed(2)),
            timestamp: new Date().toISOString()
        };

        if (res.statusCode >= 500) {
            console.error(JSON.stringify(logEntry));
        } else {
            console.log(JSON.stringify(logEntry));
        }
    });

    next();
});

// Rate limiting for application submissions
const applicationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Too many application attempts. Please try again later.",
        data: null,
        pagination: null
    }
});

// API routes
app.use("/api/internships", internships);

app.use("/api/applications", (req, res, next) => {
    if (req.method === "POST") {
        return applicationLimiter(req, res, next);
    }

    next();
}, applications);

// Database health check
app.get("/api/health", (_req, res) => {
    try {
        db.prepare("SELECT 1 AS ok").get();

        return res.status(200).json({
            status: "success",
            data: {
                ok: true,
                database: "connected"
            },
            pagination: null
        });

    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            event: "health_check_failed",
            timestamp: new Date().toISOString()
        }));

        return res.status(503).json({
            status: "error",
            message: "Service unavailable.",
            data: {
                ok: false,
                database: "disconnected"
            },
            pagination: null
        });
    }
});

// API 404 handler
app.use("/api", (_req, res) => {
    res.status(404).json({
        status: "error",
        message: "API route not found",
        data: null,
        pagination: null
    });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("*", (_req, res) => {
    res.sendFile(
        path.join(__dirname, "../../frontend/index.html")
    );
});

// Start server
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
    console.log(JSON.stringify({
        level: "info",
        event: "server_started",
        port,
        timestamp: new Date().toISOString()
    }));
});

// Graceful shutdown
function shutdown() {
    console.log("Shutting down Internship Board...");

    server.close(() => {
        db.close();
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);