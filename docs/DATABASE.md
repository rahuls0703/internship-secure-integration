# Database and seed

SQLite database is created automatically at `DATABASE_PATH` (default `backend/data/internship-board.db`).

- `internships`: source record ID is the primary key; skills/responsibilities/requirements are JSON text.
- `applications`: applicant data, internship foreign key, timestamp; unique constraint on `(internship_id, email)`.

Seed/update records:
```bash
npm run seed
```
Seed source: `backend/data/internships.json`. The five original IDs INT-101–INT-105 are preserved. Additional descriptive fields enrich the original schema.
