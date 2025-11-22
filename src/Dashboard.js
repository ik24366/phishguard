// Dashboard.js
import React from "react";

export default function Dashboard({ highContrast }) {
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
        minHeight: "100vh",
        padding: "32px"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</h1>
      <nav
        style={{
          background: boxColor,
          border: `1.5px solid ${borderColor}`,
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "32px",
        }}
        aria-label="Main Navigation"
      >
        {/* Add navigation links here */}
        <span>Nav bar</span>
      </nav>
      <div
        style={{
          display: "flex",
          gap: "32px",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {/* Left column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          <section
            style={{
              background: boxColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: "8px",
              padding: "24px",
              minHeight: "100px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h2>Welcome Message</h2>
            {/* You can add more personalized info here */}
          </section>
          <section
            style={{
              background: boxColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: "8px",
              padding: "24px",
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <h2>Training</h2>
            <button
              style={{
                background: accentColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                padding: "10px 18px",
                marginTop: "12px",
                alignSelf: "flex-start"
              }}
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
              border: `1.5px solid ${borderColor}`,
              borderRadius: "8px",
              padding: "24px",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <h2 style={{ marginBottom: "18px" }}>Progress Report</h2>
            {/* You could show % correct, badges, etc. */}
            <div style={{ marginTop: "24px" }}>
              <label htmlFor="progress-bar">Progress Bar</label>
              <progress
                id="progress-bar"
                value={70}
                max={100}
                style={{
                  width: "100%",
                  height: "24px",
                  marginTop: "8px"
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
