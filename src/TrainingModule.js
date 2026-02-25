import React, { useState, useEffect } from "react";

export default function TrainingModule({ highContrast, onNext, moduleId, onComplete }) {
  // --- STATE MANAGEMENT ---
  const [moduleData, setModuleData] = useState(null); // Stores the whole module (title, description)
  const [questions, setQuestions] = useState([]);     // Stores the list of questions
  const [currentQIndex, setCurrentQIndex] = useState(0); // Which question are we on?
  const [loading, setLoading] = useState(true);       // Loading state
  const [selectedChoice, setSelectedChoice] = useState(null); // What did the user click?
  const [feedback, setFeedback] = useState(null);     // Feedback text to show

  // --- FETCH DATA FROM DJANGO ---
  useEffect(() => {
    // 1. Safety check: Don't fetch if no ID was passed
    if (!moduleId) return;

    setLoading(true); // Always set loading to true when starting a new fetch

    // 2. Fetch the SPECIFIC module using the moduleId passed from the Dashboard
    fetch(`http://127.0.0.1:8000/api/quizzes/${moduleId}/`) // <-- THIS IS THE CRITICAL CHANGE
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch module");
        return res.json();
      })
      .then((data) => {
        // Because we fetch by ID, 'data' is ONE module object (not an array)
        setModuleData(data);
        setQuestions(data.questions); // Get the specific questions for this module
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching module:", err);
        setLoading(false);
      });
  }, [moduleId]); // <-- Re-run the fetch if the moduleId changes


  // --- STYLING (Your original code) ---
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
    boxShadow: highContrast ? "none" : "0 8px 16px rgba(15, 23, 42, 0.06)",
  };

  const buttonBase = {
    borderRadius: "999px",
    padding: "12px 28px",
    fontWeight: "600",
    border: `1px solid ${borderColor}`,
    cursor: "pointer",
    fontSize: "1rem",
  };

  // --- LOADING STATE ---
  if (loading) return <div style={{ padding: "40px" }}>Loading training data...</div>;
  if (!moduleData || questions.length === 0) return <div style={{ padding: "40px" }}>No quizzes found. Please add questions in Django Admin.</div>;

  const currentQuestion = questions[currentQIndex];

  // --- HANDLERS ---
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    // Don't show feedback yet, wait for Submit
  };

  const handleSubmit = () => {
    if (selectedChoice) {
      setFeedback(selectedChoice.feedback_text);
    }
  };

  const handleNextQuestion = () => {
    // Reset for next question
    setSelectedChoice(null);
    setFeedback(null);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // WE ARE AT THE END OF THE MODULE
      console.log("Saving progress for module:", moduleId);

      // 1. Tell App.js to save the progress
      if (onComplete) {
        onComplete();
      }

      // 2. Return to the dashboard
      onNext();
    }
  };


  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "80vh",
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header with Dynamic Data */}
      <header style={{ width: "100%", maxWidth: "960px", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "700", textAlign: "left" }}>
          {moduleData.title}
        </h1>
        <p style={{ marginTop: "8px", marginBottom: 0, fontSize: "0.98rem", color: subtleText }}>
          {moduleData.description}
        </p>
      </header>

      {/* Progress Bar */}
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
      >
        <div style={{ fontWeight: 600 }}>Module: {moduleData.title}</div>
        <div style={{ fontSize: "0.9rem", color: subtleText }}>
          Progress: <strong>{currentQIndex + 1} / {questions.length} questions</strong>
        </div>
      </nav>

      <section style={{ ...cardBase, width: "100%", maxWidth: "960px", marginBottom: "20px", textAlign: "left" }}>
        <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "1.15rem", fontWeight: "600" }}>
          Instructions
        </h2>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.98rem", lineHeight: 1.6 }}>
          <li>Review the scenario shown on the right.</li>
          <li>Select the best answer.</li>
          <li>Submit to see feedback.</li>
        </ul>
      </section>

      {/* Main Quiz Area */}
      <section style={{ width: "100%", maxWidth: "960px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "20px" }}>

        {/* LEFT: Question & Choices */}
        <div style={{ ...cardBase, flex: "1 1 320px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "1.1rem", fontWeight: "600" }}>
            Question
          </h2>
          <p style={{ marginTop: 0, marginBottom: "16px", fontSize: "0.98rem", color: subtleText }}>
            {currentQuestion.prompt_text}
          </p>

          <div role="radiogroup" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentQuestion.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                style={{
                  ...buttonBase,
                  textAlign: "left",
                  width: "100%",
                  background: selectedChoice?.id === choice.id ? accentColor : cardColor,
                  color: selectedChoice?.id === choice.id && !highContrast ? "#fff" : textColor,
                  border: selectedChoice?.id === choice.id ? `2px solid ${textColor}` : `1px solid ${borderColor}`,
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Scenario Display (Email vs SMS logic) */}
        <div style={{ ...cardBase, flex: "1 1 320px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "1.1rem", fontWeight: "600" }}>
            {currentQuestion.type === 'SMS' ? 'SMS Message' : 'Email'}
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
            {/* Conditional Rendering based on Type */}
            <p style={{ marginTop: 0 }}>
              <strong>From:</strong> {currentQuestion.sender}
            </p>

            {/* Only show Subject if it's an Email */}
            {currentQuestion.type === 'EMAIL' && (
              <p><strong>Subject:</strong> {currentQuestion.subject}</p>
            )}

            <p style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.body}</p>

            {currentQuestion.link_url && (
              <p>
                <a href="#" style={{ color: accentColor, wordBreak: 'break-all' }}>
                  {currentQuestion.link_url}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Buttons */}
      <div style={{ width: "100%", maxWidth: "960px", marginBottom: "16px", display: "flex", justifyContent: "flex-start", gap: "12px" }}>

        {!feedback ? (
          <button
            style={{ ...buttonBase, background: accentColor, color: highContrast ? "#000" : "#fff" }}
            type="button"
            onClick={handleSubmit}
            disabled={!selectedChoice} // Disable if nothing selected
          >
            Submit answer
          </button>
        ) : (
          <button
            style={{ ...buttonBase, background: accentColor, color: highContrast ? "#000" : "#fff" }}
            type="button"
            onClick={handleNextQuestion}
          >
            {currentQIndex < questions.length - 1 ? "Next Question" : "Finish Module"}
          </button>
        )}

        {!feedback && (
          <button style={{ ...buttonBase, background: cardColor, color: textColor }} type="button" onClick={handleNextQuestion}>
            Skip question
          </button>
        )}
      </div>

      {/* Feedback Section */}
      <section style={{ ...cardBase, width: "100%", maxWidth: "960px", minHeight: "96px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "1.05rem", fontWeight: "600" }}>
          Feedback
        </h2>
        <p style={{ margin: 0, fontSize: "0.96rem", color: subtleText }}>
          {feedback ? feedback : "Your feedback will appear here after you submit an answer."}
        </p>
      </section>
    </div>
  );
}
