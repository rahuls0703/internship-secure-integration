const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const tempDb = path.join(
  __dirname,
  `test-internships-${process.pid}-${Date.now()}.db`
);
process.env.DATABASE_PATH = tempDb;
process.env.PORT = "3187";
const serverProcess = spawn(process.execPath, [path.join(__dirname, "../src/server.js")], {
  env: { ...process.env, DATABASE_PATH: tempDb, PORT: "3187" }, stdio: "ignore"
});
const base = "http://127.0.0.1:3187";
async function waitServer() {
  for (let i=0;i<40;i++) { try { if ((await fetch(`${base}/api/health`)).ok) return; } catch {} await new Promise(r=>setTimeout(r,150)); }
  throw new Error("Test server did not start");
}
test("API listing, filters, detail and application validation", async t => {
  t.after(()=>{serverProcess.kill();try{fs.unlinkSync(tempDb)}catch{};try{fs.unlinkSync(tempDb+"-wal")}catch{};try{fs.unlinkSync(tempDb+"-shm")}catch{}});
  await waitServer();
  // Verify Helmet security headers
let securityResponse = await fetch(`${base}/api/health`);

assert.equal(
  securityResponse.headers.get("x-content-type-options"),
  "nosniff"
);
  const seed = spawnSyncNode();
  await seed;
  let r=await fetch(`${base}/api/internships`);let j=await r.json();
  assert.equal(r.status,200);assert.equal(j.status,"success");assert.equal(j.data.length,5);assert.equal(j.pagination.total,5);
  r=await fetch(`${base}/api/internships?domain=UI%2FUX`);j=await r.json();assert.equal(j.data.length,1);assert.equal(j.data[0].id,"INT-103");
  r=await fetch(`${base}/api/internships/INT-101`);j=await r.json();assert.equal(j.data.title,"Frontend Intern");
  r=await fetch(`${base}/api/internships/UNKNOWN`);assert.equal(r.status,404);
  r=await fetch(`${base}/api/applications`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({internshipId:"INT-101",fullName:"R",email:"bad"})});assert.equal(r.status,400);
  // Missing required fields
r = await fetch(`${base}/api/applications`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({})
});

assert.equal(r.status, 400);
  const application={internshipId:"INT-101",fullName:"Test Applicant",email:"test@example.com"};
  r=await fetch(`${base}/api/applications`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(application)});assert.equal(r.status,201);
  r=await fetch(`${base}/api/applications`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(application)});assert.equal(r.status,409);
  // Rate limiting test
for (let i = 0; i < 6; i++) {
  r = await fetch(`${base}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  });

  assert.equal(r.status, 409);
}

// The 11th POST request should be blocked
r = await fetch(`${base}/api/applications`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(application)
});

assert.equal(r.status, 429);
});
function spawnSyncNode(){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,[path.join(__dirname,"../src/database/seed.js")],{env:{...process.env,DATABASE_PATH:tempDb},stdio:"ignore"});p.on("exit",c=>c===0?resolve():reject(new Error("Seed failed")));});}
