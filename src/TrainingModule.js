import React, { useState, useEffect } from "react";

export default function TrainingModule({ highContrast, onNext, moduleId, onComplete }) {
  // --- STATE MANAGEMENT ---
  const [moduleData, setModuleData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // --- NEW: SCORING STATE ---
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);


  // --- FETCH DATA FROM DJANGO ---
  useEffect(() => {
    if (!moduleId) return;
    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/quizzes/${moduleId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch module");
        return res.json();
      })
      .then((data) => {
        setModuleData(data);
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching module:", err);
        setLoading(false);
      });
  }, [moduleId]);


  // --- STYLING ---
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
  if (loading) return <div style={{ padding: "40px", color: textColor, background: backgroundColor, minHeight: "100vh" }}>Loading training data...</div>;
  if (!moduleData || questions.length === 0) return <div style={{ padding: "40px", color: textColor, background: backgroundColor, minHeight: "100vh" }}>No quizzes found. Please add questions in Django Admin.</div>;

  // --- HANDLERS ---
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    if (selectedChoice) {
      setFeedback(selectedChoice.feedback_text);

      // NEW: Check if the answer is correct and update the score!
      if (selectedChoice.is_correct) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    // Reset for next question
    setSelectedChoice(null);
    setFeedback(null);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // NEW: Instead of returning to dashboard instantly, show the summary screen!
      setShowSummary(true);
    }
  };

  const handleFinishModule = () => {
    // Tell App.js we are done so it saves the progress
    if (onComplete) {
      onComplete();
    }
    // Return to dashboard
    onNext();
  };


  // ==========================================
  // NEW: SUMMARY SCREEN RENDER
  // ==========================================
  if (showSummary) {
    // Calculate percentage for a nice message
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Good effort! Review the modules to improve your awareness.";
    if (percentage === 100) message = "Perfect score! Excellent phishing awareness.";
    else if (percentage >= 70) message = "Great job! You identified most of the threats.";

    return (
      <div style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}>
        <section style={{ ...cardBase, width: "100%", maxWidth: "600px", textAlign: "center", padding: "40px" }}>
          <h1 style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>Module Complete!</h1>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", color: accentColor }}>
            You scored {score} out of {questions.length}
          </h2>
          <p style={{ margin: "0 0 32px 0", fontSize: "1.1rem", color: subtleText }}>
            {message}
          </p>
          <button
            style={{ ...buttonBase, background: accentColor, color: highContrast ? "#000" : "#fff", width: "100%" }}
            onClick={handleFinishModule}
          >
            Return to Dashboard
          </button>
        </section>
      </div>
    );
  }

  // ==========================================
  // NORMAL QUIZ RENDER
  // ==========================================
  const currentQuestion = questions[currentQIndex];

  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "100vh", // ensuring it covers full screen height
        width: "100%",
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
            {currentQuestion.choices.map((choice) => {
              // Highlight the correct/incorrect answer AFTER submission
              let choiceBg = cardColor;
              let choiceBorder = `1px solid ${borderColor}`;
              let choiceTextColor = textColor;

              if (feedback) { // If submitted
                if (choice.is_correct) {
                  // Always highlight correct answer in green
                  choiceBg = highContrast ? "#004d00" : "#dcfce7";
                  choiceBorder = highContrast ? "2px solid #00ff00" : "2px solid #16a34a";
                  choiceTextColor = highContrast ? "#fff" : "#166534";
                } else if (selectedChoice?.id === choice.id && !choice.is_correct) {
                  // Highlight chosen wrong answer in red
                  choiceBg = highContrast ? "#4d0000" : "#fee2e2";
                  choiceBorder = highContrast ? "2px solid #ff0000" : "2px solid #dc2626";
                  choiceTextColor = highContrast ? "#fff" : "#991b1b";
                }
              } else if (selectedChoice?.id === choice.id) { // Just selected, not submitted
                choiceBg = accentColor;
                choiceBorder = `2px solid ${textColor}`;
                choiceTextColor = highContrast ? "#000" : "#fff";
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => !feedback && handleChoiceClick(choice)} // Disable clicking after submit
                  disabled={feedback !== null}
                  style={{
                    ...buttonBase,
                    textAlign: "left",
                    width: "100%",
                    background: choiceBg,
                    color: choiceTextColor,
                    border: choiceBorder,
                    opacity: feedback && !choice.is_correct && selectedChoice?.id !== choice.id ? 0.6 : 1, // Fade out unchosen wrong answers
                  }}
                >
                  {choice.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Scenario Display */}
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
            <p style={{ marginTop: 0 }}>
              <strong>From:</strong> {currentQuestion.sender}
            </p>

            {currentQuestion.type === 'EMAIL' && (
              <p><strong>Subject:</strong> {currentQuestion.subject}</p>
            )}

            <p style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.body}</p>

            {currentQuestion.link_url && (
              <p>
                <a href={currentQuestion.link_url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, wordBreak: 'break-all' }}>
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
            style={{ ...buttonBase, background: accentColor, color: highContrast ? "#000" : "#fff", opacity: selectedChoice ? 1 : 0.5 }}
            type="button"
            onClick={handleSubmit}
            disabled={!selectedChoice}
          >
            Submit answer
          </button>
        ) : (
          <button
            style={{ ...buttonBase, background: accentColor, color: highContrast ? "#000" : "#fff" }}
            type="button"
            onClick={handleNextQuestion}
          >
            {currentQIndex < questions.length - 1 ? "Next Question" : "View Results"}
          </button>
        )}

        {!feedback && (
          <button style={{ ...buttonBase, background: cardColor, color: textColor }} type="button" onClick={handleNextQuestion}>
            Skip question
          </button>
        )}
      </div>

      {/* Feedback Section */}
      <section style={{
        ...cardBase,
        width: "100%",
        maxWidth: "960px",
        minHeight: "96px",
        // Give feedback box a subtle tint based on correct/incorrect
        background: feedback ? (selectedChoice?.is_correct ? (highContrast ? "#003300" : "#f0fdf4") : (highContrast ? "#330000" : "#fef2f2")) : cardColor,
        borderColor: feedback ? (selectedChoice?.is_correct ? "#16a34a" : "#dc2626") : borderColor
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "1.05rem",
          fontWeight: "600",
          color: feedback ? (selectedChoice?.is_correct ? (highContrast ? "#00ff00" : "#166534") : (highContrast ? "#ff4444" : "#991b1b")) : textColor
        }}>
          {feedback ? (selectedChoice?.is_correct ? "Correct!" : "Incorrect") : "Feedback"}
        </h2>
        <p style={{ margin: 0, fontSize: "0.96rem", color: feedback ? textColor : subtleText }}>
          {feedback ? feedback : "Your feedback will appear here after you submit an answer."}
        </p>
      </section>
    </div>
  );
}
