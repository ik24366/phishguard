// TrainingModule2.jsx
import React from "react";

export default function TrainingModule2({ highContrast }) {
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
        padding: "32px 16px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
          Second scenario: practice identifying phishing in SMS messages.
        </p>
      </header>

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
        <div style={{ fontWeight: 600 }}>Module: SMS & Mobile Alerts</div>
        <div
          style={{
            fontSize: "0.9rem",
            color: subtleText,
          }}
        >
          Progress: <strong>4 / 10 questions</strong>
        </div>
      </nav>

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
          <li>Review the SMS shown on the right.</li>
          <li>Select the option that best describes whether it is phishing.</li>
          <li>Use feedback to learn which signals to look for.</li>
        </ul>
      </section>

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
            Is this SMS a phishing attempt or legitimate?
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
            SMS Message
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
            <p style={{ marginTop: 0 }}>
              From: +44 7700 900123
            </p>
            <p>
              <strong>
                Your bank account is locked. Verify now:
              </strong>
            </p>
            <p>
              <a href="#fake-link" style={{ color: accentColor }}>
                http://secure-bank-login-help.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          ...cardBase,
          width: "100%",
          maxWidth: "960px",
          minHeight: "96px",
        }}
        aria-labelledby="feedback-heading-2"
      >
        <h2
          id="feedback-heading-2"
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
          This SMS uses a generic number and a suspicious link that does not
          match the official bank domain. Banks usually ask you to log in
          through their official app or website instead of unknown links.
        </p>
      </section>
    </div>
  );
}
