import React, { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import TrainingModule from "./TrainingModule";
import VishingScenario from './VishingScenario';
import { ReactComponent as PhishguardLogo } from './PhishguardLogo.svg';

export default function App() {
  const [page, setPage] = useState("login");
  const [activeModuleId, setActiveModuleId] = useState(null);

  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem("phishguard_completed");
    return saved ? JSON.parse(saved) : [];
  });

  // ACCESSIBILITY STATE
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [textScale, setTextScale] = useState(16);

  // AI STATE
  const [aiQuizData, setAiQuizData] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = highContrast ? "#000" : "#f5f7fb";
    document.body.style.color = highContrast ? "#fff" : "#111";
    document.body.style.fontFamily = dyslexicFont
      ? '"Comic Sans MS", "OpenDyslexic", sans-serif'
      : 'system-ui, -apple-system, sans-serif';
    document.documentElement.style.fontSize = `${textScale}px`;
  }, [highContrast, dyslexicFont, textScale]);

  const markModuleComplete = (moduleId) => {
    if (moduleId === "AI") return; // Don't track AI in standard completion
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) return prev;
      const newCompleted = [...prev, moduleId];
      localStorage.setItem("phishguard_completed", JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px", background: highContrast ? "#000" : "#0B1120",
        borderBottom: `1px solid ${highContrast ? "#444" : "#1e293b"}`,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#fff" }}>
          <PhishguardLogo style={{ width: "32px", height: "auto", fill: "currentColor", transform: "scale(1.2)" }} />
          <h1 style={{ fontSize: "1.3rem", margin: 0, fontWeight: "bold", letterSpacing: "0.5px" }}>
            PhishGuard
          </h1>
        </div>
        {page !== "login" && (
          <button onClick={() => { setPage("login"); setAiQuizData(null); }}
            style={{ background: "none", border: "none", color: "#e2e8f0", cursor: "pointer", fontWeight: "600", padding: "8px 12px" }}>
            Log Out
          </button>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: page === "login" ? "center" : "flex-start", padding: "24px" }}>
        {page === "login" && <LoginForm onLogin={() => setPage("dashboard")} highContrast={highContrast} />}

        {page === "dashboard" && (
          <Dashboard
            highContrast={highContrast}
            completedModules={completedModules}
            onStartTraining={(id, generatedData = null) => {
              setActiveModuleId(id);
              setAiQuizData(generatedData);
              setPage("training");
            }}
          />
        )}

        {page === "training" && (
          <TrainingModule
            moduleId={activeModuleId}
            highContrast={highContrast}
            aiQuizData={aiQuizData}
            onNext={() => { setPage("dashboard"); setAiQuizData(null); setActiveModuleId(null); }}
            onComplete={(id) => markModuleComplete(id)}
          />
        )}
      </main>

      {/* ACCESSIBILITY FAB */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50 }}>
        {showAccessMenu && (
          <div style={{
            position: "absolute", bottom: "60px", right: "0", background: highContrast ? "#333" : "#fff",
            border: `1px solid ${highContrast ? "#555" : "#e5e7eb"}`, borderRadius: "12px", padding: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "250px", display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>Accessibility</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} /> High Contrast
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={dyslexicFont} onChange={() => setDyslexicFont(!dyslexicFont)} /> Dyslexic Font
            </label>
            <div>
              <span style={{ fontSize: "0.875rem" }}>Text Size</span>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={() => setTextScale(s => Math.max(12, s - 2))} style={{ flex: 1 }}>A-</button>
                <button onClick={() => setTextScale(16)} style={{ flex: 1 }}>A</button>
                <button onClick={() => setTextScale(s => Math.min(24, s + 2))} style={{ flex: 1 }}>A+</button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowAccessMenu(!showAccessMenu)}
          style={{ background: "#000", color: "#fff", border: "none", borderRadius: "999px", padding: "12px 20px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          Accessibility
        </button>
      </div>
    </div>
  );
}