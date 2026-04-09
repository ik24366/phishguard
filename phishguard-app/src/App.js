import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import TrainingModule from "./TrainingModule"; // Ensure this matches your component's name
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [highContrast, setHighContrast] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);

  // NEW: State to hold the AI generated quiz data
  const [aiQuizData, setAiQuizData] = useState(null);

  const [completedModules, setCompletedModules] = useState([]);

  // Load accessibility and completion states from localStorage on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem("phishguard_highContrast") === "true";
    if (savedContrast) {
      setHighContrast(true);
      document.body.classList.add("high-contrast-body");
    }

    const savedCompleted = localStorage.getItem("phishguard_completed");
    if (savedCompleted) {
      try {
        setCompletedModules(JSON.parse(savedCompleted));
      } catch (e) {
        console.error("Error parsing completed modules", e);
      }
    }
  }, []);

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const newVal = !prev;
      localStorage.setItem("phishguard_highContrast", newVal);
      if (newVal) {
        document.body.classList.add("high-contrast-body");
      } else {
        document.body.classList.remove("high-contrast-body");
      }
      return newVal;
    });
  };

  const markModuleComplete = (modId) => {
    // If it's the AI module, don't add it to the normal completion progress
    if (modId === "AI") return;

    setCompletedModules((prev) => {
      if (prev.includes(modId)) return prev;
      const newVal = [...prev, modId];
      localStorage.setItem("phishguard_completed", JSON.stringify(newVal));
      return newVal;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <header
        style={{
          width: "100%",
          padding: "16px 24px",
          background: highContrast ? "#000" : "#fff",
          borderBottom: `1px solid ${highContrast ? "#fff" : "#e2e8f0"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: highContrast ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: highContrast ? "#fff" : "#111" }}>
          PhishGuard
        </div>
        {page !== "login" && (
          <button
            onClick={() => {
              setPage("login");
              setActiveModuleId(null);
              setAiQuizData(null); // Clear AI data on logout
            }}
            style={{
              background: "transparent",
              border: "none",
              color: highContrast ? "#fff" : "#0f172a",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem",
              textDecoration: "underline",
            }}
            aria-label="Log out of PhishGuard"
          >
            Log Out
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main
        id="main-content"
        style={{
          flex: "1 1 0%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
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
            completedModules={completedModules}
            onStartTraining={(moduleId, customData = null) => {
              // NEW: Check if this is an AI quiz
              if (moduleId === "AI" && customData) {
                setAiQuizData(customData);
                setActiveModuleId("AI");
              } else {
                // Normal database quiz
                setActiveModuleId(moduleId);
                setAiQuizData(null);
              }
              setPage("training");
            }}
          />
        )}

        {page === "training" && (
          <TrainingModule
            highContrast={highContrast}
            moduleId={activeModuleId}
            aiData={aiQuizData} // NEW: Pass the AI data to the training module
            onComplete={() => markModuleComplete(activeModuleId)}
            onNext={() => {
              setPage("dashboard");
              setActiveModuleId(null);
              setAiQuizData(null); // Clear after completing
            }}
          />
        )}
      </main>

      {/* Global Footer (Accessibility Toggle) */}
      <footer
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 100,
        }}
      >
        <button
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          style={{
            background: highContrast ? "#fff" : "#111",
            color: highContrast ? "#000" : "#fff",
            border: highContrast ? "2px solid #000" : "none",
            borderRadius: "999px",
            padding: "12px 20px",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {highContrast ? "Standard Contrast" : "Accessibility"}
        </button>
      </footer>
    </div>
  );
}
