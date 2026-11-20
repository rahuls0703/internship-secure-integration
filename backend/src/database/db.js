const path = require("node:path");
const fs = require("node:fs");
const Database = require("better-sqlite3");

const configured = process.env.DATABASE_PATH || "./backend/data/internship-board.db";
const dbPath = path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, domain TEXT NOT NULL,
    mode TEXT NOT NULL, location TEXT NOT NULL, skills TEXT NOT NULL,
    openings INTEGER NOT NULL, company TEXT, duration TEXT, stipend TEXT,
    description TEXT, responsibilities TEXT, requirements TEXT
  );
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internship_id TEXT NOT NULL REFERENCES internships(id),
    full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
    resume_url TEXT, cover_letter TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(internship_id, email)
  );
`);

module.exports = db;
