import logo from './logo.svg';
import './App.css';
//import React from 'react';
import AccessibleButton from './AccessibleButton';
import LoginForm from "./LoginForm";
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import TrainingModule from "./TrainingModule";

//export default App;
export default function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [page, setPage] = useState("login");
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: highContrast ? "#000" : "#f5f7fb",
      color: highContrast ? "#fff" : "#111",
      minHeight: "100vh"
    }}>
      <header style={{ padding: "20px" }}>
        <h1>PhishGuard</h1>
      </header>
      <main style={{
        flex: 1, display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        {page === "login" && (
          <LoginForm highContrast={highContrast} onLogin={() => setPage("dashboard")} />
        )}
        {page === "dashboard" && (
          <Dashboard
            highContrast={highContrast}
            onStartTraining={() => setPage("training")}
          />
        )}
        {page === "training" && (
          <TrainingModule highContrast={highContrast} />
        )}
      </main>
      <footer style={{
        position: "fixed",
        right: "32px",
        bottom: "32px",
        zIndex: 100,
      }}>
        <button
          aria-pressed={highContrast}
          aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
          onClick={() => setHighContrast((hc) => !hc)}
        >
          Accessibility
        </button>
      </footer>
    </div>
  );
}
