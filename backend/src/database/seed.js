require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const db = require("./db");

const seedPath = path.join(__dirname, "../../data/internships.json");
const records = JSON.parse(fs.readFileSync(seedPath, "utf8")).internships;
const insert = db.prepare(`
  INSERT INTO internships
  (id,title,domain,mode,location,skills,openings,company,duration,stipend,description,responsibilities,requirements)
  VALUES (@id,@title,@domain,@mode,@location,@skills,@openings,@company,@duration,@stipend,@description,@responsibilities,@requirements)
  ON CONFLICT(id) DO UPDATE SET
    title=excluded.title, domain=excluded.domain, mode=excluded.mode,
    location=excluded.location, skills=excluded.skills, openings=excluded.openings,
    company=excluded.company, duration=excluded.duration, stipend=excluded.stipend,
    description=excluded.description, responsibilities=excluded.responsibilities,
    requirements=excluded.requirements
`);
const seed = db.transaction((rows) => {
  for (const item of rows) insert.run({
    ...item, skills: JSON.stringify(item.skills),
    responsibilities: JSON.stringify(item.responsibilities || []),
    requirements: JSON.stringify(item.requirements || [])
  });
});
seed(records);
console.log(`Seeded ${records.length} internships.`);
db.close();
