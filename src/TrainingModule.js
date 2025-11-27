import React from "react";

export default function TrainingModule({ highContrast }) {
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

  const buttonBase = {
    borderRadius: "999px",
    padding: "12px 28px",
    fontWeight: "600",
    border: `1px solid ${borderColor}`,
    cursor: "pointer",
    fontSize: "1rem",
  };

  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "80vh",
        padding: "32px 16px 50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Page header */}
      <header
        style={{
          width: "100%",
          maxWidth: "960px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: "700",
            textAlign: "left",
          }}
        >
          Training Module
        </h1>
        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "0.98rem",
            color: subtleText,
          }}
        >
          Practice identifying phishing attempts using realistic scenarios
          and immediate feedback.
        </p>
      </header>

      {/* Top bar (could hold breadcrumbs / progress) */}
      <nav
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "960px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        aria-label="Training module navigation"
      >
        <div style={{ fontWeight: 600 }}>Module: Email Phishing Basics</div>
        <div
          style={{
            fontSize: "0.9rem",
            color: subtleText,
          }}
        >
          Progress: <strong>3 / 10 questions</strong>
        </div>
      </nav>

      {/* Instructions */}
      <section
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "960px",
          marginBottom: "20px",
          textAlign: "left",
        }}
        aria-labelledby="instructions-heading"
      >
        <h2
          id="instructions-heading"
          style={{
            marginTop: 0,
            marginBottom: "8px",
            fontSize: "1.15rem",
            fontWeight: "600",
          }}
        >
          Instructions
        </h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "0.98rem",
            lineHeight: 1.6,
          }}
        >
          <li>Review the email or message shown on the right.</li>
          <li>Select the option that best describes whether it is phishing.</li>
          <li>Use the feedback area below to understand what you missed.</li>
        </ul>
      </section>

      {/* Main interaction area */}
      <section
        style={{
          width: "100%",
          maxWidth: "960px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
        aria-label="Quiz content"
      >
        {/* Multiple-choice panel */}
        <div
          style={{
            ...cardBase,
            flex: "1 1 320px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Question
          </h2>
          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "0.98rem",
              color: subtleText,
            }}
          >
            Is this message a phishing attempt or legitimate?
          </p>
          <div
            role="radiogroup"
            aria-label="Answer options"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {["Definitely phishing", "Probably phishing", "Legitimate"].map(
              (label) => (
                <button
                  key={label}
                  style={{
                    ...buttonBase,
                    textAlign: "left",
                    width: "100%",
                    background: cardColor,
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Scenario panel */}
        <div
          style={{
            ...cardBase,
            flex: "1 1 320px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Email / Message
          </h2>
          <div
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              textAlign: "left",
              borderRadius: "8px",
              padding: "12px 14px",
              background: highContrast ? "#111" : "#f9fafb",
              border: `1px solid ${borderColor}`,
            }}
          >
            {/* Placeholder text – replace with real scenario */}
            <p style={{ marginTop: 0 }}>
              From: “IT Support” &lt;security-update@company-support.com&gt;
            </p>
            <p>
              Subject: <strong>Urgent: Your account will be disabled</strong>
            </p>
            <p>
              Your password has expired. Click the link below within 24 hours
              to keep your account active:
            </p>
            <p>
              <a href="#fake-link" style={{ color: accentColor }}>
                http://company-support-security.com/reset
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Action buttons */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "flex-start",
          gap: "12px",
        }}
      >
        <button
          style={{
            ...buttonBase,
            background: accentColor,
            color: highContrast ? "#000" : "#fff",
          }}
        >
          Submit answer
        </button>
        <button
          style={{
            ...buttonBase,
            background: cardColor,
            color: textColor,
          }}
        >
          Skip question
        </button>
      </div>

      {/* Feedback section */}
      <section
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "960px",
          minHeight: "96px",
        }}
        aria-labelledby="feedback-heading"
      >
        <h2
          id="feedback-heading"
          style={{
            marginTop: 0,
            marginBottom: "8px",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          Feedback
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.96rem",
            color: subtleText,
          }}
        >
          Your feedback will appear here after you submit an answer. It will
          highlight key warning signs and explain what you should look for
          next time.
        </p>
      </section>
    </div>
  );
}
