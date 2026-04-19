# 🎣 PhishGuard

PhishGuard is an advanced, accessible cybersecurity awareness platform built as a Final Year Project. It utilizes a gamified learning methodology and an OpenAI-powered Generative Engine to create zero-day phishing simulations on the fly. 

**[🖼️ View Project Poster](./OtherDocs/phishguardposter.pdf)**
<img width="3179" height="4494" alt="posterimg" src="https://github.com/user-attachments/assets/3efbab9e-0289-439f-b59c-ac005be81d3d" />

---

## 🚀 Key Features

*   **Adaptive AI Threat Engine:** Dynamically generates sophisticated phishing scenarios using OpenAI (Vectors: SMS, Email, Social Media).
*   **Point-of-Error Feedback:** Users receive immediate, actionable pedagogical feedback the exact moment they make a decision.
*   **Gamification Mechanics:** Features persistent progress tracking, daily streaks, and experience levels designed to encourage habit-building learning.
*   **Universal Accessibility (WCAG 2.1):** High-contrast modes, intuitive routing, and semantic markup ensure inclusive training delivery.
*   **Decoupled Architecture:** A hyper-responsive React.js frontend powered by a robust Django (Python) / PostgreSQL backend API.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* React.js (Create React App workflow)
* `@react-aria/button` (Accessibility Tokens)
* Standard CSS3 (Custom Design System)

**Backend (Server)**
* Python 3
* Django & Django REST Framework (Token Authentication)
* PostgreSQL Database
* Docker & Docker Compose

**AI Integration**
* OpenAI API (Zero-Day Threat Synthesis)

---

## ⚙️ Getting Started (Docker Environment)

This project is fully containerized using Docker, allowing both the React frontend and Django/PostgreSQL backend to run simultaneously without requiring local Node.js or Python environments.

### 1. Configure Environment Variables
Create a `.env` file in the root directory (where `docker-compose.yml` is located) and add your OpenAI API Key to enable the Generative AI Threat Engine:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. Build and Start the Containers
Ensure Docker Desktop is running, then execute the following in the project root:
```bash
docker compose up --build
```
*The React frontend will be available at `http://localhost:3000/` and the Django API at `http://localhost:8000/`.*

### 3. Apply Database Migrations
Open a new terminal window and run the following to build the database tables:
```bash
docker compose exec backend python manage.py migrate
```

### 4. Load Initial Curated Data (Required)
By default, the Docker database is empty. To populate the pre-curated training modules and learning paths, you must restore the provided SQL backup file into the PostgreSQL container.

First, copy the backup file into the database container:
```bash
docker cp phishguard-backend/phishguard_backup.sql phishguard-db-1:/phishguard_backup.sql
```

Next, execute the SQL file to restore the data:
```bash
docker exec -i phishguard-db-1 psql -U ismailkhan -d phishguard_db -f /phishguard_backup.sql
```
*(Note: You can safely ignore any "relation already exists" warnings during this process. Refresh `http://localhost:3000` after this completes to view the populated dashboard).*