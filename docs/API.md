# API reference

All API responses use `{ status, data, pagination }`. Errors additionally include `message`; validation errors may include `data.errors`.

## `GET /api/health`
Returns `{ status:"success", data:{ok:true}, pagination:null }`.

## `GET /api/internships`
Query parameters:
- `q`: searches title, domain, company and skills.
- `domain`: exact domain filter.
- `mode`: exact work-mode filter.
- `page`: 1-based page number (default 1).
- `limit`: 1–20 (default 10).

Example: `/api/internships?q=frontend&mode=Remote&page=1&limit=6`

Success: `data` is an array; `pagination` contains `page`, `limit`, `total`, and `totalPages`.

## `GET /api/internships/filters`
Returns arrays of distinct `domains` and `modes`.

## `GET /api/internships/:id`
Returns one internship object or 404.

## `POST /api/applications`
JSON body:
```json
{
  "internshipId": "INT-101",
  "fullName": "Example Student",
  "email": "student@example.com",
  "phone": "",
  "resumeUrl": "https://example.com/resume",
  "coverLetter": "I am interested in this role."
}
```
Returns 201 on success, 400 on validation errors, and 409 for duplicate internship/email pairs. Resume URLs must be HTTP(S). The API never logs applicant request bodies or personal records.
