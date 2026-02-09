// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import TrainingModule from "./TrainingModule";
//import TrainingModule2 from "./TrainingModule2";

export default function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [page, setPage] = useState("login");

  // Keep body background in sync with contrast mode
  useEffect(() => {
    document.body.style.backgroundColor = highContrast ? "#000" : "#f5f7fb";
    document.body.style.color = highContrast ? "#fff" : "#111";
  }, [highContrast]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: highContrast ? "#000" : "#f5f7fb",
        color: highContrast ? "#fff" : "#111",
      }}
    >
      {/* Top brand bar */}
      <header
        style={{
          padding: "16px 24px",
          fontWeight: 700,
          fontSize: "1.4rem",
        }}
      >
        PhishGuard
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: page === "login" ? "center" : "flex-start",
        }}
      >
        {page === "login" && (
          <LoginForm
            highContrast={highContrast}
            onLogin={() => setPage("dashboard")}
          />
        )}

        {page === "dashboard" && (
          <Dashboard
            highContrast={highContrast}
            onStartTraining={() => setPage("training")}
          />
        )}

        {page === "training" && (
          <TrainingModule
            highContrast={highContrast}
            onNext={() => setPage("dashboard")}
          />
        )}

        {/*{page === "training2" && (
          <TrainingModule2 highContrast={highContrast} />
        )}*/}
      </main>

      {/* Accessibility toggle */}
      <footer
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 100,
        }}
      >
        <button
          aria-pressed={highContrast}
          aria-label={
            highContrast
              ? "Disable high contrast mode"
              : "Enable high contrast mode"
          }
          onClick={() => setHighContrast((hc) => !hc)}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid #d0d4e4",
            background: highContrast ? "#fff" : "#111",
            color: highContrast ? "#000" : "#fff",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Accessibility
        </button>
      </footer>
    </div>
  );
}
