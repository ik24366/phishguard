// LoginForm.js
import React, { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form style={{ border: "1px solid #ccc", padding: "30px", borderRadius: "10px", display: "flex", flexDirection: "column", minWidth: "350px" }}>
      <h2 style={{textAlign: "center"}}>log in</h2>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" placeholder="username" style={{ marginBottom: "15px" }} />
      <label htmlFor="password">Password</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input id="password" type={showPassword ? "text" : "password"} placeholder="password" style={{ flex: 1 }} />
        <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: "10px" }}>
          {/* Simple eye icon (could be replaced with SVG) */}
          
        </button>
      </div>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <button type="submit" style={{ flex: 1, marginRight: "10px" }}>log in</button>
        <button type="button" style={{ flex: 1 }}>sign up</button>
      </div>
      <a href="#forgot" style={{ textAlign: "center", marginTop: "15px" }}>Forgot Password</a>
    </form>
  );
}
