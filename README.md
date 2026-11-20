<div align="center">

# 🎓 Internship Board

### Discover opportunities. Explore internships. Apply with confidence.

A responsive full-stack internship portal where students can explore internship listings, filter opportunities, view details, and submit applications through a validated application form.

<br/>

<div align="center">

</div>

![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 📌 Overview

**Internship Board** is a full-stack web application designed to make internship discovery and application easier. It provides a clean, responsive interface backed by a REST API and SQLite database.

The application includes sample internship records and supports searching, filtering, viewing internship information, and applying to opportunities.

## ✨ Features

- **Browse internships** with structured listing cards.
- **Search opportunities** by title, domain, or skills.
- **Filter listings** by internship domain and work mode.
- **View internship details** in a dedicated dialog.
- **Submit applications** with applicant and internship information.
- **Client-side and server-side validation** for application data.
- **Email typo detection** for common domain mistakes (for example, `gmal.co` instead of `gmail.com`).
- **Duplicate application prevention** for the same internship and email.
- **Responsive interface** for desktop, tablet, and mobile.
- **Accessible interactions** with keyboard-friendly controls.
- **Loading, empty, error, and retry states** for a better user experience.

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| API | REST |
| Testing | Node.js built-in test runner |
| Development | npm, Git, GitHub |

## 🖥️ Screenshots

### Homepage
![Internship Board Homepage](docs/images/homepage.png)

### Filters
![Internship Board Filter Section](docs/images/filters.png)

### Internship Details
![Internship Details](docs/images/internship-details.png)

### Application Form
![Application Form](docs/images/application-form.png)

## 🚀 Getting Started

### Prerequisites

- **Node.js 22** (recommended for this project)
- npm (included with Node.js)
- Git (optional, for cloning)

### 1. Clone the repository

```bash
git clone https://github.com/rahuls0703/internship-secure-integration.git
cd internship-secure-integration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Seed the internship data

```bash
npm run seed
```

### 4. Start the application

```bash
npm start
```

### 5. Open in your browser

Visit:

```text
http://localhost:3000
```

The Express server serves the frontend and API from the same application.

## 🗂️ Project Structure

```text
internship-board/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       └── validation.js
├── backend/
│   ├── data/
│   │   └── internships.json
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   └── seed.js
│   │   ├── routes/
│   │   │   ├── internships.js
│   │   │   └── applications.js
│   │   └── server.js
│   └── tests/
│       └── api.test.js
├── docs/
│   ├── ACCESSIBILITY.md
│   ├── API.md
│   └── DATABASE.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🔌 API Overview

The backend exposes REST endpoints for internship listings and applications.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/internships` | Retrieve internship listings |
| `GET` | `/api/internships/:id` | Retrieve a specific internship |
| `POST` | `/api/applications` | Submit an internship application |

For request parameters, payload examples, and response formats, see **[API Documentation](docs/API.md)**.

## 🔐 Security Implementation

The application implements multiple security measures to protect API endpoints and application data.

- **Helmet:** Configures secure HTTP headers to improve application security.
- **Rate Limiting:** Restricts excessive application submission requests using `express-rate-limit` (10 requests per 15 minutes).
- **Parameterized SQL Queries:** Uses prepared statements to protect database operations against SQL injection.
- **Server-side Validation:** Validates application data before processing submissions.
- **Client-side Validation:** Provides immediate feedback for invalid form inputs.
- **Request Size Limits:** Restricts incoming JSON and URL-encoded request payloads to 20 KB.

## 🧪 Automated Testing

Automated API tests verify:

- Internship listing and filtering.
- Internship detail retrieval.
- Invalid application rejection.
- Missing required field rejection.
- Successful application submission.
- Duplicate application prevention.
- Helmet security headers.
- API rate-limit enforcement.

Run the tests using:

```bash
npm test
```

## 🧪 Run Tests

Run the project's automated tests using:

```bash
npm test
```

## 🗄️ Database

Internship and application data are managed using SQLite. The seed script initializes the sample internship records.

For database setup and schema details, see **[Database Documentation](docs/DATABASE.md)**.

## ♿ Accessibility

The interface includes keyboard-friendly interactions and accessible UI behavior.

See **[Accessibility Documentation](docs/ACCESSIBILITY.md)**.

## 🛣️ Future Enhancements

- Internship bookmarking and saved listings.
- Applicant dashboard with application status.
- Authentication for students and recruiters.
- Recruiter tools to create and manage internship postings.
- Email notifications for application updates.
- Deployment with a managed database and production environment configuration.

## 👨‍💻 Author

**Rahul S**  
B.E. Computer Science and Engineering  
Chennai Institute of Technology

- GitHub: [@rahuls0703](https://github.com/rahuls0703)
- Project Repository: [internship-secure-integration](https://github.com/rahuls0703/internship-secure-integration)
## 🤝 Acknowledgements

This project was developed as part of a full-stack web development internship task. The internship listing dataset contains sample/fictional records for demonstration purposes.

---

<div align="center">

**Built with ❤️ using HTML, CSS, JavaScript, Node.js, Express, and SQLite**

</div>
