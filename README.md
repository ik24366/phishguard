# 🎣 PhishGuard

PhishGuard is an advanced, accessible cybersecurity awareness platform built as a Final Year Project. It utilizes a gamified learning methodology and an OpenAI-powered Generative Engine to create zero-day phishing simulations on the fly. 

**[🖼️ View Project Poster](./OtherDocs/phishguardposter.pdf)**

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

**AI Integration**
* OpenAI API (Zero-Day Threat Synthesis)

---

## ⚙️ Getting Started (Local Development)

This project requires simultaneous execution of the frontend client and the backend server.

### 1. Backend Setup (Django)
```bash
cd phishguard-backend
# Ensure PostgreSQL is running locally
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
*The backend API serves on `http://127.0.0.1:8000/`*

### 2. Frontend Setup (React)
Open a new terminal window:
```bash
cd phishguard-app
npm install
npm start
```
*The app will automatically open at `http://localhost:3000/`*

---


