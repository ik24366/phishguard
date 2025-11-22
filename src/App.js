import logo from './logo.svg';
import './App.css';
//import React from 'react';
import AccessibleButton from './AccessibleButton';
import LoginForm from "./LoginForm";
import React, { useState } from "react";

//export default App;
export default function App() {
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: highContrast ? "#000" : "#fff",
        color: highContrast ? "#fff" : "#000",
        minHeight: "100vh"
      }}
    >
      <header style={{ padding: "20px" }}>
        <h1>PhishGuard</h1>
      </header>
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <LoginForm highContrast={highContrast} />
      </main>
      <footer style={{ position: "absolute", right: "20px", bottom: "20px" }}>
        <button
          aria-pressed={highContrast}
          aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
          onClick={() => setHighContrast(hc => !hc)}
        >
          Accessibility
        </button>
      </footer>
    </div>
  );
}