import React, { useState, useEffect } from "react";

// NEW: Add completedModules to props
export default function Dashboard({ highContrast, onStartTraining, completedModules = [] }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false); //  Track AI loading state

  const [aiVector, setAiVector] = useState("mixed");
  const [aiDifficulty, setAiDifficulty] = useState("intermediate");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/modules/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setModules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load modules:", err);
        setLoading(false);
      });
  }, []);

  // --- NEW: AI Fetch Function ---
  const fetchAIQuiz = async () => {
    try {
      setAiLoading(true);
      console.log(`Fetching AI Quiz from Django (Vector: ${aiVector}, Difficulty: ${aiDifficulty})...`);

      // UPDATE THIS FETCH URL TO INCLUDE THE NEW VARIABLES
      const response = await fetch(`http://localhost:8000/api/generate-ai-quiz/?vector=${aiVector}&difficulty=${aiDifficulty}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) throw new Error("Failed to generate AI quiz");
      const aiQuizData = await response.json();


      console.log("SUCCESS! Here is the AI data:", aiQuizData);
      alert("AI Quiz generated successfully! Check your browser console to see the JSON data. Wiring it to the training module is the next step!");

      // Next Step: You will pass this to your TrainingModule component
      onStartTraining("AI", aiQuizData);

    } catch (error) {
      console.error("Failed to fetch AI Quiz:", error);
      alert("Failed to generate AI Quiz. Check your Django terminal for errors.");
    } finally {
      setAiLoading(false);
    }
  };


  const backgroundColor = highContrast ? "#222" : "#f5f7fb";
  const cardColor = highContrast ? "#333" : "#fff";
  const textColor = highContrast ? "#fff" : "#111";
  const borderColor = highContrast ? "#fff" : "#d0d4e4";
  const accentColor = highContrast ? "#ff0" : "#0073e6";
  const subtleText = highContrast ? "#ccc" : "#4b5563";

  const cardBase = {
    background: cardColor,
    border: `1.5px solid ${borderColor}`,
    borderRadius: "12px",
    padding: "24px 28px",
    boxShadow: highContrast
      ? "none"
      : "0 8px 16px rgba(15, 23, 42, 0.06)",
  };

  const pillButton = {
    borderRadius: "999px",
    padding: "12px 26px",
    fontWeight: 600,
    border: `1px solid ${borderColor}`,
    cursor: "pointer",
    fontSize: "0.98rem",
  };


  // --- Calculate Progress ---
  const totalModules = modules.length;
  // Ensure we don't count completed modules that might have been deleted from the database
  const validCompletedCount = completedModules.filter(id =>
    modules.some(mod => mod.id === id)
  ).length;

  // Calculate percentage (avoid dividing by zero)
  const progressPercentage = totalModules === 0 ? 0 : Math.round((validCompletedCount / totalModules) * 100);

  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 48px",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.2rem",
            fontWeight: 700,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "0.98rem",
            color: subtleText,
          }}
        >
          Track your phishing awareness training and continue where you left off.
        </p>
      </header>

      {/* Top bar (nav / quick info) */}
      <nav
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        aria-label="Main navigation"
      >
        <div style={{ fontWeight: 600 }}>PhishGuard Home</div>
        <div
          style={{
            fontSize: "0.9rem",
            color: subtleText,
          }}
        >
          Last login: <strong>Today</strong>
        </div>
      </nav>

      {/* Main content: 2 columns */}
      <main
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        {/* Left column */}
        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Welcome card */}
          <section
            style={{
              ...cardBase,
              minHeight: "180px",
            }}
            aria-labelledby="welcome-heading"
          >
            <h2
              id="welcome-heading"
              style={{
                marginTop: 0,
                marginBottom: "8px",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.98rem",
                color: subtleText,
                lineHeight: 1.6,
              }}
            >
              Continue your phishing awareness journey with short, focused
              training modules. Your progress and feedback help you build
              safer online habits over time.
            </p>
          </section>

          {/* DYNAMIC TRAINING MODULES LIST */}
          <section
            style={{
              ...cardBase,
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
            }}
            aria-labelledby="training-heading"
          >
            <h2
              id="training-heading"
              style={{
                marginTop: 0,
                marginBottom: "8px",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Available Training Modules
            </h2>

            {loading ? (
              <p style={{ color: subtleText }}>Loading modules...</p>
            ) : modules.length === 0 ? (
              <p style={{ color: subtleText }}>No modules found. Please add them in Django Admin.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
                {modules.map((mod) => {
                  // Check if this module is completed
                  const isCompleted = completedModules.includes(mod.id);

                  return (
                    <div
                      key={mod.id}
                      style={{
                        padding: "16px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: highContrast ? "#222" : "#f9fafb"
                      }}
                    >
                      <div>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
                          {mod.title}
                          {isCompleted && (
                            <span style={{ color: "green", fontSize: "1.2rem" }} title="Completed">✓</span>
                          )}
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: subtleText }}>
                          {mod.description || "Learn to identify threats in this scenario."}
                        </p>
                      </div>
                      <button
                        style={{
                          ...pillButton,
                          background: isCompleted ? (highContrast ? "#444" : "#e5e7eb") : accentColor,
                          color: isCompleted ? (highContrast ? "#fff" : "#4b5563") : (highContrast ? "#000" : "#fff"),
                          border: isCompleted ? "none" : `1px solid ${borderColor}`,
                          padding: "8px 20px",
                          whiteSpace: "nowrap",
                          marginLeft: "16px"
                        }}
                        onClick={() => onStartTraining(mod.id)}
                        aria-label={`${isCompleted ? "Retake" : "Start"} ${mod.title} training`}
                      >
                        {isCompleted ? "Retake" : "Start"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Progress & AI Mode */}
        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <section
            style={{
              ...cardBase,
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
            }}
            aria-labelledby="progress-heading"
          >
            <h2
              id="progress-heading"
              style={{
                marginTop: 0,
                marginBottom: "8px",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Progress report
            </h2>
            <p
              style={{
                marginTop: 0,
                marginBottom: "16px",
                fontSize: "0.96rem",
                color: subtleText,
              }}
            >
              Overall completion of current training path.
            </p>

            <label
              htmlFor="progress-bar"
              style={{
                fontSize: "0.95rem",
                marginBottom: "6px",
              }}
            >
              Training completion ({progressPercentage}%)
            </label>
            <progress
              id="progress-bar"
              value={progressPercentage}
              max={100}
              style={{
                width: "100%",
                height: "40px",
              }}
              aria-valuenow={progressPercentage}
              aria-valuemax={100}
              aria-label={`Training completion ${progressPercentage} percent`}
            />

            <div
              style={{
                marginTop: "10px",
                fontSize: "0.9rem",
                color: subtleText,
              }}
            >
              <strong>{validCompletedCount} / {totalModules}</strong> core quizzes completed
            </div>
          </section>

          {/* --- NEW: EXPANDED AI GENERATOR CARD --- */}
          <section
            style={{
              ...cardBase,
              border: `2px solid ${accentColor}`,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1, // This is the magic CSS that forces it to stretch down!
              justifyContent: "space-between"
            }}
            aria-labelledby="ai-heading"
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2
                  id="ai-heading"
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span role="img" aria-label="robot">🤖</span> Adaptive AI Threats
                </h2>
                <span style={{
                  background: highContrast ? '#ff0' : '#e0e7ff',
                  color: highContrast ? '#000' : '#3730a3',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  BETA
                </span>
              </div>

              <p style={{ color: subtleText, fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Go beyond the basics. Our Generative AI engine creates zero-day, highly sophisticated phishing scenarios on the fly. No two simulations are ever the same.
              </p>

              {/* Middle Section: Configuration Options */}
              <div style={{
                background: highContrast ? '#111' : '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                border: `1px solid ${borderColor}`
              }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 12px 0', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Configure Simulation
                </h3>

                {/* Option 1: Threat Vector */}
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="threat-vector" style={{ display: 'block', fontSize: '0.85rem', color: subtleText, marginBottom: '6px', fontWeight: '500' }}>
                    Target Vector
                  </label>
                  <select
                    id="threat-vector"
                    value={aiVector}
                    onChange={(e) => setAiVector(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '6px',
                      border: `1px solid ${borderColor}`, background: cardColor, color: textColor,
                      fontSize: '0.95rem', cursor: 'pointer'
                    }}
                  >
                    <option value="mixed">Mixed (All Vectors)</option>
                    <option value="email">Corporate Email</option>
                    <option value="sms">Mobile & SMS</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>

                {/* Option 2: Difficulty */}
                <div>
                  <label htmlFor="difficulty" style={{ display: 'block', fontSize: '0.85rem', color: subtleText, marginBottom: '6px', fontWeight: '500' }}>
                    Sophistication Level
                  </label>
                  <select
                    id="difficulty"
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '6px',
                      border: `1px solid ${borderColor}`, background: cardColor, color: textColor,
                      fontSize: '0.95rem', cursor: 'pointer'
                    }}
                  >
                    <option value="intermediate">Intermediate (Standard)</option>
                    <option value="advanced">Advanced (Spear-Phishing)</option>
                    <option value="expert">Expert (Zero-Day Exploits)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Section: Generate Button */}
            <button
              style={{
                ...pillButton,
                background: accentColor,
                color: highContrast ? "#000" : "#fff",
                border: "none",
                padding: "16px",
                width: "100%",
                fontSize: "1.05rem",
                marginTop: "auto",
                cursor: aiLoading ? "not-allowed" : "pointer",
                opacity: aiLoading ? 0.7 : 1,
              }}
              onClick={fetchAIQuiz}
              disabled={aiLoading}
              aria-label="Generate an AI Phishing Scenario"
            >
              {aiLoading ? "Generating Zero-Day Threat..." : "⚡ Generate AI Scenario"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}