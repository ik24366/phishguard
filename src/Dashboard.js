import React from "react";

export default function Dashboard({ highContrast, onStartTraining }) {
  // Style helpers for high contrast
  const backgroundColor = highContrast ? "#222" : "#fff";
  const boxColor = highContrast ? "#333" : "#fff";
  const textColor = highContrast ? "#fff" : "#000";
  const borderColor = highContrast ? "#fff" : "#ccc";
  const accentColor = highContrast ? "#ff0" : "#0073e6";

  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0",
      }}
    >
      <h1 style={{
        textAlign: "center",
        margin: "40px 0 16px 0",
        fontSize: "2.4rem"
      }}>Dashboard</h1>
      <nav
        style={{
          background: boxColor,
          border: `1.5px solid ${borderColor}`,
          borderRadius: "10px",
          padding: "26px",
          marginBottom: "36px",
          maxWidth: "1100px",
          width: "93%",
        }}
        aria-label="Main Navigation"
      >
        <span>Nav bar</span>
      </nav>
      <div
        style={{
          display: "flex",
          gap: "56px",
          justifyContent: "center",
          alignItems: "stretch",
          width: "93%",
          maxWidth: "1100px",
        }}
      >
        {/* Left column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "36px" }}>
          <section
            style={{
              background: boxColor,
              border: `2px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "40px",
              minHeight: "210px",
              minWidth: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h2 style={{ fontWeight: "bold", margin: 0 }}>Welcome Message</h2>
          </section>
          <section
            style={{
              background: boxColor,
              border: `2px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "40px",
              minHeight: "210px",
              minWidth: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <h2 style={{ fontWeight: "bold", margin: 0 }}>Training</h2>
            <button
              style={{
                background: accentColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                padding: "16px 38px",
                marginTop: "26px",
                alignSelf: "flex-start"
              }}
              onClick={onStartTraining}
              aria-label="Start phishing training"
            >
              Start
            </button>
          </section>
        </div>
        {/* Right column */}
        <div style={{ flex: 1 }}>
          <section
            style={{
              background: boxColor,
              border: `2px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "40px",
              minHeight: "440px",
              minWidth: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <h2 style={{ fontWeight: "bold", marginBottom: "28px" }}>Progress Report</h2>
            <div style={{ marginTop: "38px" }}>
              <label htmlFor="progress-bar">Progress Bar</label>
              <progress
                id="progress-bar"
                value={70}
                max={100}
                style={{
                  width: "100%",
                  height: "32px",
                  marginTop: "8px",
                  borderRadius: "4px"
                }}
                aria-valuenow={70}
                aria-valuemax={100}
                aria-label="Training completion 70 percent"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
