import React, { useState } from "react";

export default function LoginForm({ highContrast, onLogin }) {
  // --- PRESERVED: Your toggle state ---
  const [showPassword, setShowPassword] = useState(false);

  // --- NEW: State to track input and backend errors ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Color helpers (Preserved your exact colors)
  const backgroundColor = highContrast ? "#222" : "#fff";
  const borderColor = highContrast ? "#fff" : "#ccc";
  const textColor = highContrast ? "#fff" : "#000";
  const inputBackground = highContrast ? "#333" : "#fff";
  const inputText = highContrast ? "#fff" : "#000";
  const accentColor = highContrast ? "#ff0" : "#0073e6";

  // --- NEW: The fetch function to talk to Django ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      // Pointing to the Django endpoint we made in Step 1
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Log in success: Save token and trigger your onLogin prop
        localStorage.setItem("phishguard_token", data.token);
        localStorage.setItem("phishguard_username", username);
        onLogin();
      } else {
        // Log in failed
        setErrorMsg("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Unable to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // <-- Now triggers our fetch logic instead of just onLogin()
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

      {/* NEW: Display the error message if login fails */}
      {errorMsg && (
        <div style={{
          color: highContrast ? "#ff0000" : "red",
          marginBottom: "15px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {errorMsg}
        </div>
      )}

      <label htmlFor="username" style={{ color: textColor }}>Username</label>
      <input
        id="username"
        type="text"
        placeholder="username"
        required // <-- Added required
        value={username} // <-- Bound to state
        onChange={(e) => setUsername(e.target.value)} // <-- Captures typing
        style={{
          marginBottom: "15px",
          background: inputBackground,
          color: inputText,
          border: `1px solid ${borderColor}`,
          padding: "8px" // Added slight padding so text doesn't touch the edge
        }}
      />

      <label htmlFor="password" style={{ color: textColor }}>Password</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          required // <-- Added required
          value={password} // <-- Bound to state
          onChange={(e) => setPassword(e.target.value)} // <-- Captures typing
          style={{
            flex: 1,
            background: inputBackground,
            color: inputText,
            border: `1px solid ${borderColor}`,
            padding: "8px"
          }}
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginLeft: "10px", cursor: "pointer", background: "none", border: "none", fontSize: "1.2rem" }}
        >
          👁
        </button>
      </div>

      <div style={{ display: "flex", marginTop: "20px" }}>
        <button
          type="submit"
          disabled={isLoading} // <-- Prevent double-clicking while loading
          style={{
            flex: 1,
            marginRight: "10px",
            background: highContrast ? "#000" : "#eee",
            color: highContrast ? "#fff" : "#000",
            border: `1px solid ${borderColor}`,
            padding: "10px",
            cursor: isLoading ? "wait" : "pointer",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "logging in..." : "log in"}
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            background: highContrast ? "#000" : "#eee",
            color: highContrast ? "#fff" : "#000",
            border: `1px solid ${borderColor}`,
            padding: "10px",
            cursor: "pointer"
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
          color: accentColor,
          textDecoration: "underline",
        }}
      >
        Forgot Password
      </a>
    </form>
  );
}
