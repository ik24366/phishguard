import React, { useState, useEffect } from "react";
import AccessibleButton from "./AccessibleButton";

export default function TrainingModule({
  highContrast,
  moduleId,
  aiData, // NEW: We receive AI data here
  onComplete,
  onNext,
}) {
  const [moduleData, setModuleData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // NEW: If we are in AI mode, skip the fetch and load the AI data!
    if (moduleId === "AI" && aiData) {
      setModuleData({
        id: "AI",
        title: "AI Generated Threat Scenario",
        description: "This scenario was dynamically generated based on real-world threat datasets.",
      });
      // The AI returns a single scenario, so we wrap it in an array to match your state structure
      setQuestions([aiData]);
      setLoading(false);
      return; // Stop the useEffect here
    }

    // NORMAL MODE: Fetch from Django
    fetch(`http://127.0.0.1:8000/api/quizzes/${moduleId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch module");
        return res.json();
      })
      .then((data) => {
        setModuleData(data);
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          // fallback if Django structure is different
          setQuestions([{
            id: 999,
            type: "email",
            sender: "unknown@example.com",
            subject: "Sample",
            body: "No questions array found.",
            isPhishing: true,
            red_flags_explanation: "Placeholder"
          }]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching module:", err);
        setLoading(false);
      });
  }, [moduleId, aiData]);

  // Color variables
  const backgroundColor = highContrast ? "#222" : "#f5f7fb";
  const textColor = highContrast ? "#fff" : "#111";
  const cardColor = highContrast ? "#333" : "#fff";
  const borderColor = highContrast ? "#fff" : "#d0d4e4";
  const subtleText = highContrast ? "#ccc" : "#4b5563";
  const accentColor = highContrast ? "#ff0" : "#0073e6";
  const focusOutline = highContrast ? "3px solid #ff0" : "3px solid #0073e6";

  const cardBase = {
    background: cardColor,
    border: `1.5px solid ${borderColor}`,
    borderRadius: "12px",
    padding: "24px 28px",
    boxShadow: highContrast ? "none" : "0 8px 16px rgba(15, 23, 42, 0.06)",
  };

  const navButton = {
    background: "transparent",
    border: "none",
    color: highContrast ? "#fff" : "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.95rem",
    textDecoration: "underline",
  };

  // Logic
  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    const currentQ = questions[currentIndex];

    // AI data uses 'isPhishing', typical Django data uses 'is_phishing'
    // We check for both to make sure it handles both properly
    const actualIsPhishing = currentQ.isPhishing !== undefined ? currentQ.isPhishing : currentQ.is_phishing;

    const userSaidPhishing = answer === "Phishing";
    setIsCorrect(actualIsPhishing === userSaidPhishing);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
      if (onNext) onNext();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", color: textColor, background: backgroundColor, minHeight: "100vh" }}>
        Loading module...
      </div>
    );
  }

  if (!moduleData || questions.length === 0) {
    return (
      <div style={{ padding: "40px", color: textColor, background: backgroundColor, minHeight: "100vh" }}>
        No quiz data found.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  // Determine if it's an email or SMS scenario
  const isSms = currentQ.type === "sms";

  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 48px",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: "1100px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "12px" }}>
            {moduleData.title}
            {/* NEW: Show AI Badge if it's the AI Module */}
            {moduleId === "AI" && (
              <span style={{
                fontSize: "0.9rem",
                background: highContrast ? "#fff" : "#7c3aed",
                color: highContrast ? "#000" : "#fff",
                padding: "4px 12px",
                borderRadius: "999px",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}>🤖 AI GENERATED</span>
            )}
          </h1>
          <p style={{ marginTop: "6px", marginBottom: 0, color: subtleText }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <button onClick={onNext} style={navButton} aria-label="Exit training module">
          Exit Module
        </button>
      </header>

      {/* Main split view */}
      <main
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        {/* Left Column: The Scenario */}
        <section
          style={{
            ...cardBase,
            flex: "1 1 400px",
            display: "flex",
            flexDirection: "column",
          }}
          aria-label="Phishing Scenario"
        >
          <div
            style={{
              background: highContrast ? "#000" : "#f1f5f9",
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              padding: "16px",
              flex: 1,
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
            tabIndex="0" // make scenario focusable for screen readers to read sequentially
            aria-live="polite"
          >
            {isSms ? (
              // SMS View
              <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                <div
                  style={{
                    background: highContrast ? "#333" : "#dcf8c6",
                    color: highContrast ? "#fff" : "#000",
                    padding: "12px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    marginBottom: "12px",
                    fontSize: "0.95rem",
                    border: highContrast ? "1px solid #fff" : "none",
                  }}
                >
                  <p style={{ margin: "0 0 6px 0", fontWeight: 600, fontSize: "0.85rem" }}>
                    From: {currentQ.sender}
                  </p>
                  <p style={{ margin: 0 }}>{currentQ.body}</p>
                </div>
              </div>
            ) : (
              // Email View
              <div>
                <div
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                    paddingBottom: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontWeight: 600 }}>
                    From: <span style={{ fontWeight: 400 }}>{currentQ.sender}</span>
                  </p>
                  {currentQ.subject && (
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      Subject: <span style={{ fontWeight: 400 }}>{currentQ.subject}</span>
                    </p>
                  )}
                </div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {currentQ.body}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Interaction & Feedback */}
        <section
          style={{
            ...cardBase,
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
          }}
          aria-live="polite"
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px", fontSize: "1.1rem" }}>
            Is this scenario legitimate or a phishing attempt?
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <AccessibleButton
              onClick={() => handleAnswerSubmit("Legitimate")}
              disabled={showFeedback}
              highContrast={highContrast}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                borderRadius: "8px",
                border:
                  showFeedback && selectedAnswer === "Legitimate"
                    ? `2px solid ${accentColor}`
                    : `1px solid ${borderColor}`,
                background: highContrast ? "#222" : "#fff",
                color: textColor,
                cursor: showFeedback ? "default" : "pointer",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.outline = focusOutline)}
              onBlur={(e) => (e.target.style.outline = "none")}
            >
              Legitimate
            </AccessibleButton>

            <AccessibleButton
              onClick={() => handleAnswerSubmit("Phishing")}
              disabled={showFeedback}
              highContrast={highContrast}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                borderRadius: "8px",
                border:
                  showFeedback && selectedAnswer === "Phishing"
                    ? `2px solid ${accentColor}`
                    : `1px solid ${borderColor}`,
                background: highContrast ? "#222" : "#fff",
                color: textColor,
                cursor: showFeedback ? "default" : "pointer",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.outline = focusOutline)}
              onBlur={(e) => (e.target.style.outline = "none")}
            >
              Phishing
            </AccessibleButton>
          </div>

          {/* Feedback Area */}
          {showFeedback && (
            <div
              style={{
                marginTop: "auto",
                padding: "16px",
                borderRadius: "8px",
                background: isCorrect
                  ? highContrast ? "#003300" : "#ecfdf5"
                  : highContrast ? "#4a0000" : "#fef2f2",
                border: isCorrect
                  ? `1px solid ${highContrast ? "#0f0" : "#10b981"}`
                  : `1px solid ${highContrast ? "#f00" : "#ef4444"}`,
              }}
              role="alert"
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "1.05rem",
                  color: isCorrect
                    ? highContrast ? "#0f0" : "#065f46"
                    : highContrast ? "#f00" : "#991b1b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isCorrect ? (
                  <>
                    <span aria-hidden="true">✅</span> Correct!
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">❌</span> Incorrect
                  </>
                )}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: isCorrect
                    ? highContrast ? "#fff" : "#064e3b"
                    : highContrast ? "#fff" : "#7f1d1d",
                }}
              >
                {/* Fallback support for both camelCase and snake_case backend names */}
                {currentQ.red_flags_explanation || currentQ.explanation || currentQ.red_flags || "This was generated dynamically to test your awareness."}
              </p>

              <AccessibleButton
                onClick={handleNext}
                highContrast={highContrast}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "12px",
                  background: highContrast ? "#fff" : "#0f172a",
                  color: highContrast ? "#000" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.outline = focusOutline)}
                onBlur={(e) => (e.target.style.outline = "none")}
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Module"}
              </AccessibleButton>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}