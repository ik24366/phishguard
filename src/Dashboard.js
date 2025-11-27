import React from "react";

export default function Dashboard({ highContrast, onStartTraining }) {
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

          {/* Training call-to-action */}
          <section
            style={{
              ...cardBase,
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            aria-labelledby="training-heading"
          >
            <div>
              <h2
                id="training-heading"
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Training modules
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.96rem",
                  color: subtleText,
                }}
              >
                Start a new module or continue where you left off. Each session
                takes about 5–10 minutes.
              </p>
            </div>
            <button
              style={{
                ...pillButton,
                marginTop: "18px",
                background: accentColor,
                color: highContrast ? "#000" : "#fff",
                alignSelf: "flex-start",
              }}
              onClick={onStartTraining}
              aria-label="Start phishing training"
            >
              Start training
            </button>
          </section>
        </div>

        {/* Right column: Progress */}
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
