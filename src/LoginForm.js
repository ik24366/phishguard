// LoginForm.js
import React, { useState } from "react";

export default function LoginForm({ highContrast }) {
  const [showPassword, setShowPassword] = useState(false);

  // Choose colors based on highContrast
  const backgroundColor = highContrast ? "#222" : "#fff";
  const borderColor = highContrast ? "#fff" : "#ccc";
  const textColor = highContrast ? "#fff" : "#000";
  const inputBackground = highContrast ? "#333" : "#fff";
  const inputText = highContrast ? "#fff" : "#000";

  return (
    <form
      style={{
        border: `2px solid ${borderColor}`,
        padding: "30px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        minWidth: "350px",
        background: backgroundColor,
        color: textColor,
      }}
    >
      <h2 style={{ textAlign: "center", color: textColor }}>log in</h2>
      <label htmlFor="username" style={{ color: textColor }}>Username</label>
      <input
        id="username"
        type="text"
        placeholder="username"
        style={{
          marginBottom: "15px",
          background: inputBackground,
          color: inputText,
          border: `1px solid ${borderColor}`,
        }}
      />
      <label htmlFor="password" style={{ color: textColor }}>Password</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          style={{
            flex: 1,
            background: inputBackground,
            color: inputText,
            border: `1px solid ${borderColor}`,
          }}
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginLeft: "10px" }}
        >
          👁
        </button>
      </div>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            marginRight: "10px",
            background: highContrast ? "#000" : "#eee",
            color: highContrast ? "#fff" : "#000",
            border: `1px solid ${borderColor}`,
          }}
        >
          log in
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            background: highContrast ? "#000" : "#eee",
            color: highContrast ? "#fff" : "#000",
            border: `1px solid ${borderColor}`,
          }}
        >
          sign up
        </button>
      </div>
      <a
        href="#forgot"
        style={{
          textAlign: "center",
          marginTop: "15px",
          color: highContrast ? "#ff0" : "#0073e6",
          textDecoration: "underline",
        }}
      >
        Forgot Password
      </a>
    </form>
  );
}

