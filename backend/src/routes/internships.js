const express = require("express");
const db = require("../database/db");
const router = express.Router();

function parseRecord(row) {
  return { ...row, skills: JSON.parse(row.skills),
    responsibilities: JSON.parse(row.responsibilities || "[]"),
    requirements: JSON.parse(row.requirements || "[]") };
}
function envelope(data, pagination = null) {
  return { status: "success", data, pagination };
}

// GET /api/internships?q=&domain=&mode=&page=&limit=
router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 100);
  const domain = String(req.query.domain || "").trim();
  const mode = String(req.query.mode || "").trim();
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const where = []; const params = {};
  if (q) { where.push("(title LIKE @q OR domain LIKE @q OR company LIKE @q OR skills LIKE @q)"); params.q = `%${q}%`; }
  if (domain) { where.push("domain = @domain"); params.domain = domain; }
  if (mode) { where.push("mode = @mode"); params.mode = mode; }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = db.prepare(`SELECT COUNT(*) AS count FROM internships ${clause}`).get(params).count;
  const rows = db.prepare(`SELECT * FROM internships ${clause} ORDER BY title LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset: (page - 1) * limit }).map(parseRecord);
  res.json(envelope(rows, { page, limit, total, totalPages: Math.ceil(total / limit) }));
});

router.get("/filters", (_req, res) => {
  const domains = db.prepare("SELECT DISTINCT domain FROM internships ORDER BY domain").all().map(x => x.domain);
  const modes = db.prepare("SELECT DISTINCT mode FROM internships ORDER BY mode").all().map(x => x.mode);
  res.json(envelope({ domains, modes }));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ status: "error", message: "Internship not found", data: null, pagination: null });
  res.json(envelope(parseRecord(row)));
});
module.exports = router;
