import React, { useState, useEffect } from "react";

export default function Dashboard({ highContrast, onStartTraining }) {
  // --- NEW: State for our Modules ---
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: Fetch Modules from Django ---
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
        setLoading(false); // Stop loading even if it fails so UI isn't blocked
      });
  }, []);

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
        {/* Left column: Welcome & Module List */}
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
                {modules.map((mod) => (
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
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem" }}>{mod.title}</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: subtleText }}>
                        {mod.description || "Learn to identify threats in this scenario."}
                      </p>
                    </div>
                    <button
                      style={{
                        ...pillButton,
                        background: accentColor,
                        color: highContrast ? "#000" : "#fff",
                        padding: "8px 20px", // slightly smaller button for the list
                        whiteSpace: "nowrap",
                        marginLeft: "16px"
                      }}
                      onClick={() => onStartTraining(mod.id)} // Pass the specific ID!
                      aria-label={`Start ${mod.title} training`}
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Progress (Still Hardcoded for now) */}
        <section
          style={{
            ...cardBase,
            flex: "1 1 320px",
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
            Training completion
          </label>
          <progress
            id="progress-bar"
            value={70}
            max={100}
            style={{
              width: "100%",
              height: "40px",
            }}
            aria-valuenow={70}
            aria-valuemax={100}
            aria-label="Training completion 70 percent"
          />

          <div
            style={{
              marginTop: "10px",
              fontSize: "0.9rem",
              color: subtleText,
            }}
          >
            <strong>7 / 10</strong> core quizzes completed
          </div>
        </section>
      </main>
    </div>
  );
}
