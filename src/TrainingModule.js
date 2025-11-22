import React from "react";

export default function TrainingModule({ highContrast }) {
  // Put your wireframe layout here next!
  return (
    <div style={{
      color: highContrast ? "#fff" : "#000",
      background: highContrast ? "#222" : "#fff",
      minHeight: "100vh",
      padding: "40px"
    }}>
      <h1 style={{textAlign: "center"}}>Training Module</h1>
      {/* Navigation bar, instructions, questions, scenario */}
      {/* Submit / Skip buttons, Feedback, Accessibility */}
    </div>
  );
}
