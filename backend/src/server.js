require("dotenv").config();
const path = require("node:path");
const express = require("express");
const helmet = require("helmet");
const db = require("./database/db");
const rateLimit = require("express-rate-limit");
const internships = require("./routes/internships");
const applications = require("./routes/applications");

const app = express();
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
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
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use("/api/internships", internships);
app.use("/api/applications", (req, res, next) => {
    if (req.method === "POST") {
        return applicationLimiter(req, res, next);
    }
    next();
}, applications);
app.get("/api/health", (_req, res) => res.json({ status:"success", data:{ ok:true }, pagination:null }));
app.use("/api", (_req, res) => res.status(404).json({ status:"error", message:"API route not found", data:null, pagination:null }));
app.use(express.static(path.join(__dirname, "../../frontend")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../../frontend/index.html")));

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => console.log(`Internship Board running on http://localhost:${port}`));
function shutdown() { server.close(() => { db.close(); process.exit(0); }); }
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
