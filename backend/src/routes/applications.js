const express = require("express");
const db = require("../database/db");
const router = express.Router();

const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
const emailDomainTypos = {
  "gmal.co": "gmail.com", "gmal.com": "gmail.com", "gmial.com": "gmail.com",
  "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com",
  "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahho.com": "yahoo.com",
  "outlok.com": "outlook.com", "outloo.com": "outlook.com", "hotmal.com": "hotmail.com"
};
function safeHttpUrl(value) {
  if (!value) return true;
  try { const u = new URL(value); return ["http:", "https:"].includes(u.protocol); }
  catch { return false; }
}

router.post("/", (req, res) => {
  const body = req.body || {};
  const internshipId = String(body.internshipId || "").trim();
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const resumeUrl = String(body.resumeUrl || "").trim();
  const coverLetter = String(body.coverLetter || "").trim();

  const errors = {};
  if (!internshipId || !db.prepare("SELECT id FROM internships WHERE id=?").get(internshipId)) errors.internshipId = "Choose a valid internship.";
  if (fullName.length < 2 || fullName.length > 80) errors.fullName = "Name must be 2–80 characters.";
  if (!emailPattern.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  } else {
    const domain = email.split("@")[1];
    if (emailDomainTypos[domain]) errors.email = `Check your email domain. Did you mean @${emailDomainTypos[domain]}?`;
  }
  if (phone && phone.length > 25) errors.phone = "Phone number is too long.";
  if (!safeHttpUrl(resumeUrl)) errors.resumeUrl = "Resume URL must use http or https.";
  if (coverLetter.length > 2000) errors.coverLetter = "Cover letter must be 2,000 characters or less.";
  if (Object.keys(errors).length) return res.status(400).json({ status:"error", message:"Please correct the highlighted fields.", data:{errors}, pagination:null });

  try {
    const result = db.prepare(`INSERT INTO applications
      (internship_id,full_name,email,phone,resume_url,cover_letter) VALUES (?,?,?,?,?,?)`)
      .run(internshipId, fullName, email, phone || null, resumeUrl || null, coverLetter || null);
    // Never log applicant data or request bodies.
    return res.status(201).json({ status:"success", message:"Application submitted successfully.", data:{ applicationId: result.lastInsertRowid }, pagination:null });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return res.status(409).json({ status:"error", message:"You have already applied to this internship with this email.", data:null, pagination:null });
    return res.status(500).json({ status:"error", message:"Unable to save application. Please try again.", data:null, pagination:null });
  }
});
module.exports = router;
