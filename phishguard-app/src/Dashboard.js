import React, { useState, useEffect } from "react";

export default function Dashboard({ highContrast, onStartTraining, completedModules = [] }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [userStats, setUserStats] = useState({ level: 1, streak: 0, score: 0 });
  const [activityLog, setActivityLog] = useState([]);

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
      })
      .catch((err) => {
        console.error("Failed to load modules:", err);
      });

    const token = localStorage.getItem("phishguard_token");
    fetch("http://127.0.0.1:8000/api/user-stats/", {
      headers: {
        "Authorization": `Token ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user stats");
        return res.json();
      })
      .then((data) => {
        setUserStats({
          level: data.level ?? 1,
          streak: data.streak ?? 0,
          score: data.score ?? 0,
        });
      })
      .catch((err) => {
        console.error("Failed to load user stats:", err);
        setUserStats({ level: 1, streak: 0, score: 0 });
      })
      .finally(() => {
        setLoading(false);
      });

    fetch("http://127.0.0.1:8000/api/user-history/", {
      headers: {
        "Authorization": `Token ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivityLog(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load user history:", err);
      });
  }, []);

  const fetchAIQuiz = async () => {
    try {
      setAiLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/generate-ai-quiz/?vector=${aiVector}&difficulty=${aiDifficulty}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to generate AI quiz");
      const aiQuizData = await response.json();
      onStartTraining("AI", aiQuizData);
    } catch (error) {
      console.error("Failed to fetch AI Quiz:", error);
      alert("Failed to generate AI Quiz. Check your Django terminal for errors.");
    } finally {
      setAiLoading(false);
    }
  };

  const backgroundColor = highContrast ? "#000" : "#f8fafc";
  const cardColor = highContrast ? "#000" : "#ffffff";
  const textColor = highContrast ? "#fff" : "#0f172a";
  const borderColor = highContrast ? "#fff" : "#e2e8f0";
  const accentColor = highContrast ? "#ff0" : "#2563eb"; // Modern Slate Blue
  const subtleText = highContrast ? "#ccc" : "#64748b";
  const successColor = highContrast ? "#0f0" : "#10b981"; // Emerald Green
  const streakColor = highContrast ? "#ff0" : "#f59e0b"; // Amber/Gold

  const cardBase = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: "16px",
    padding: "24px 28px",
    boxShadow: highContrast ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  };

  const pillButton = {
    borderRadius: "8px",
    padding: "10px 24px",
    fontWeight: 700,
    border: `1px solid ${borderColor}`,
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s"
  };

  const totalModules = modules.length;
  const validCompletedCount = completedModules.filter((id) =>
    modules.some((mod) => mod.id === id)
  ).length;
  const progressPercentage =
    totalModules === 0 ? 0 : Math.round((validCompletedCount / totalModules) * 100);

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
      <header
        style={{
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.5rem",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            color: textColor
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "1.05rem",
            color: subtleText,
          }}
        >
          Track your phishing awareness training and continue where you left off.
        </p>
      </header>

      <nav
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: highContrast ? "#000" : "#ffffff",
          padding: "16px 24px",
          borderLeft: `6px solid ${accentColor}`
        }}
        aria-label="Current Status Summary"
      >
        <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>PhishGuard Home</div>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: subtleText,
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ color: accentColor }}>Lv. {userStats.level}</span>
          <span style={{ color: borderColor }}>|</span>
          <span style={{ color: streakColor }}>🔥 {userStats.streak} day streak</span>
        </div>
      </nav>

      <main
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <section
            style={cardBase}
            aria-labelledby="welcome-heading"
          >
            <h2
              id="welcome-heading"
              style={{
                marginTop: 0,
                marginBottom: "20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: subtleText,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Overview
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "16px 0",
                flexWrap: "wrap",
                gap: "24px"
              }}
            >
              <div style={{ flex: 1, minWidth: "100px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "800", color: accentColor }}>
                  {userStats.level}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: subtleText, textTransform: "uppercase" }}>Current Level</div>
              </div>

              <div style={{ flex: 1, minWidth: "100px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "800", color: streakColor }}>
                  {userStats.streak}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: subtleText, textTransform: "uppercase" }}>Day Streak</div>
              </div>

              <div style={{ flex: 1, minWidth: "100px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "800", color: successColor }}>
                  {userStats.score}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: subtleText, textTransform: "uppercase" }}>Total Score</div>
              </div>
            </div>
          </section>

          <section
            style={{
              ...cardBase,
              display: "flex",
              flexDirection: "column",
            }}
            aria-labelledby="training-heading"
          >
            <h2
              id="training-heading"
              style={{
                marginTop: 0,
                marginBottom: "20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: subtleText,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Learning Paths
            </h2>

            {loading ? (
              <p style={{ color: subtleText }}>Loading modules...</p>
            ) : modules.length === 0 ? (
              <p style={{ color: subtleText }}>No modules found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {modules.map((mod) => {
                  const isCompleted = completedModules.includes(mod.id);

                  return (
                    <div
                      key={mod.id}
                      style={{
                        padding: "20px",
                        border: `1.5px solid ${borderColor}`,
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: highContrast ? "#000" : (isCompleted ? "#f8fafc" : "#fff"),
                        transition: "transform 0.2s"
                      }}
                    >
                      <div style={{ paddingRight: "12px" }}>
                        <h3
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: textColor
                          }}
                        >
                          {mod.title}
                          {isCompleted && (
                            <span style={{ color: successColor, fontSize: "1.2rem" }} title="Completed">
                              ✓
                            </span>
                          )}
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: subtleText, lineHeight: "1.4" }}>
                          {mod.description}
                        </p>
                      </div>

                      <button
                        style={{
                          ...pillButton,
                          background: isCompleted ? (highContrast ? "#000" : "#ebf2ff") : accentColor,
                          color: isCompleted ? (highContrast ? "#fff" : accentColor) : (highContrast ? "#000" : "#fff"),
                          border: isCompleted ? `1.5px solid ${accentColor}` : "none",
                          padding: "10px 20px",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => onStartTraining(mod.id)}
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

        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <section
            style={cardBase}
            aria-labelledby="progress-heading"
          >
            <h2
              id="progress-heading"
              style={{
                marginTop: 0,
                marginBottom: "20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: subtleText,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Your Progress
            </h2>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-end",
              marginBottom: "8px"
            }}>
               <span style={{ fontSize: "1.5rem", fontWeight: "800", color: textColor }}>{progressPercentage}%</span>
               <span style={{ fontSize: "0.85rem", fontWeight: "600", color: subtleText }}>{validCompletedCount} / {totalModules} Modules</span>
            </div>
            
            <div style={{ 
              width: "100%", 
              height: "12px", 
              background: highContrast ? "#222" : "#f1f5f9", 
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "16px"
            }}>
              <div style={{ 
                width: `${progressPercentage}%`, 
                height: "100%", 
                background: accentColor,
                borderRadius: "999px"
              }}></div>
            </div>

            <p style={{ margin: 0, fontSize: "0.9rem", color: subtleText, lineHeight: "1.5" }}>
              Complete all modules to unlock the **Advanced AI Simulator**.
            </p>
          </section>

          <section
            style={{
              ...cardBase,
              border: highContrast ? `2px solid yellow` : `2px solid ${accentColor}`,
              position: "relative",
              overflow: "hidden"
            }}
            aria-labelledby="ai-heading"
          >
            <div style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              background: accentColor,
              color: "#fff",
              padding: "20px 40px 10px",
              transform: "rotate(45deg)",
              fontSize: "0.7rem",
              fontWeight: "900",
              display: highContrast ? "none" : "block"
            }}>PRO</div>

            <h2
              id="ai-heading"
              style={{
                margin: "0 0 16px 0",
                fontSize: "1.5rem",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: textColor
              }}
            >
              Adaptive AI Simulations
            </h2>

            <p
              style={{
                color: subtleText,
                fontSize: "1rem",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              Generate zero-day, tailor-made phishing scenarios using our Generative AI engine.
            </p>

            <div
              style={{
                background: highContrast ? "#111" : "#f8fafc",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
                border: `1.5px solid ${borderColor}`,
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="threat-vector" style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: subtleText, marginBottom: "8px" }}>
                  Primary Attack Vector
                </label>
                <select
                  id="threat-vector"
                  value={aiVector}
                  onChange={(e) => setAiVector(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${borderColor}`,
                    background: cardColor,
                    color: textColor,
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                >
                  <option value="mixed">Mixed Strategy</option>
                  <option value="email">Corporate Email</option>
                  <option value="sms">Mobile SMS</option>
                  <option value="social">Social Media</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: subtleText, marginBottom: "8px" }}>
                  Simulation Sophistication
                </label>
                <select
                  id="difficulty"
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${borderColor}`,
                    background: cardColor,
                    color: textColor,
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                >
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced (Spear-Phish)</option>
                  <option value="expert">Expert (Zero-Day)</option>
                </select>
              </div>
            </div>

            <button
              style={{
                ...pillButton,
                background: accentColor,
                color: highContrast ? "#000" : "#fff",
                border: "none",
                padding: "16px",
                width: "100%",
                fontSize: "1.1rem",
                boxShadow: highContrast ? "none" : "0 4px 14px 0 rgba(37, 99, 235, 0.39)"
              }}
              onClick={fetchAIQuiz}
              disabled={aiLoading}
            >
              {aiLoading ? "Modeling Threat..." : "⚡ Launch Live Simulation"}
            </button>
          </section>
        </div>

        <section
          style={{
            ...cardBase,
            width: "100%",
            marginTop: "8px",
          }}
          aria-labelledby="history-heading"
        >
          <h2
            id="history-heading"
            style={{
              marginTop: 0,
              marginBottom: "24px",
              fontSize: "1.25rem",
              fontWeight: "700",
              color: subtleText,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            Training Log
          </h2>

          {activityLog.length === 0 ? (
            <p style={{ color: subtleText }}>Complete a session to populate your log.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activityLog.map((log) => {
                const date = new Date(log.last_attempted);
                return (
                  <div
                    key={log.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: highContrast ? "#111" : "#fff",
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "1rem", color: textColor }}>{log.module_title}</div>
                      <div style={{ color: subtleText, fontSize: "0.85rem", marginTop: "2px" }}>
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{
                      fontWeight: "800",
                      color: successColor,
                      fontSize: "1.1rem"
                    }}>
                      +{log.score} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}