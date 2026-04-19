import React, { useState } from "react";

export default function LoginForm({ highContrast, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Theme Palette
  const backgroundColor = highContrast ? "#000" : "#f8fafc";
  const cardBackground = highContrast ? "#000" : "#ffffff";
  const borderColor = highContrast ? "#fff" : "#e2e8f0";
  const textColor = highContrast ? "#fff" : "#1e293b";
  const labelColor = highContrast ? "#fff" : "#64748b";
  const inputBackground = highContrast ? "#111" : "#fff";
  const accentColor = highContrast ? "#ff0" : "#2563eb";
  const secondaryBtnBg = highContrast ? "#000" : "#f1f5f9";
  const secondaryBtnText = highContrast ? "#fff" : "#475569";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const endpoint = isLogin ? "login/" : "register/";
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("phishguard_token", data.token);
        localStorage.setItem("phishguard_username", data.username || username);
        onLogin();
      } else {
        setErrorMsg(data.error || (isLogin ? "Invalid credentials." : "Registration failed."));
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Server unreachable. Ensure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        background: cardBackground,
        border: `1px solid ${borderColor}`,
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: highContrast ? "none" : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ 
            fontSize: "1.85rem", 
            fontWeight: "800", 
            color: textColor, 
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px"
          }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: labelColor, fontSize: "0.95rem", margin: 0 }}>
            {isLogin ? "Log in to continue your training" : "Start your phishing awareness journey"}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: highContrast ? "#300" : "#fef2f2",
            color: highContrast ? "#f00" : "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: "600",
            border: highContrast ? "1px solid red" : "none",
            textAlign: "center"
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="username" style={{ fontSize: "0.85rem", fontWeight: "600", color: labelColor }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. user123"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                background: inputBackground,
                color: textColor,
                border: `1.5px solid ${borderColor}`,
                borderRadius: "8px",
                padding: "12px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="password" style={{ fontSize: "0.85rem", fontWeight: "600", color: labelColor }}>
              Password
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  background: inputBackground,
                  color: textColor,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: "8px",
                  padding: "12px",
                  paddingRight: "50px",
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box" // Critical fix for overflow
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "6px", // Adjusted for better internal alignment
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: labelColor,
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center"
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: accentColor,
              color: highContrast ? "#000" : "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: isLoading ? "wait" : "pointer",
              transition: "all 0.2s",
              boxShadow: highContrast ? "none" : "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
            }}
          >
            {isLoading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          marginTop: "8px"
        }}>
          <div style={{ flex: 1, height: "1px", background: borderColor }}></div>
          <span style={{ fontSize: "0.8rem", color: labelColor }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: borderColor }}></div>
        </div>

        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
          style={{
            background: secondaryBtnBg,
            color: secondaryBtnText,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: "12px",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </button>

        {isLogin && (
          <button style={{
            background: "none",
            border: "none",
            color: accentColor,
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "underline"
          }}>
            Forgot Password?
          </button>
        )}
      </div>
    </div>
  );
}
