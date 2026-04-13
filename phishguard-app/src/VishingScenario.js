import React from 'react';

const VishingScenario = ({ callerId, audioSrc, transcript, highContrast }) => {
    const containerBg = highContrast ? '#111' : '#f9fafb';
    const textColor = highContrast ? '#fff' : '#111';
    const borderColor = highContrast ? '#fff' : '#d0d4e4';
    const transcriptBg = highContrast ? '#333' : '#fff';
    const transcriptBorder = highContrast ? '#ff0' : '#0073e6';

    return (
        <div
            style={{
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: containerBg,
                color: textColor,
                textAlign: 'left'
            }}
            role="region"
            aria-labelledby="vishing-title"
        >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: highContrast ? '#ccc' : '#666', margin: '0' }}>
                    Incoming Voicemail...
                </p>
                <h3 id="vishing-title" style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                    {callerId || "Unknown Caller"}
                </h3>
            </div>

            {/* Accessible Audio Player */}
            <audio
                controls
                src={audioSrc}
                style={{ width: '100%', marginBottom: '20px' }}
                aria-label={`Voicemail audio from ${callerId || "Unknown Caller"}`}
            >
                Your browser does not support the audio element.
            </audio>

            {/* Transcript for Accessibility */}
            <div
                style={{
                    backgroundColor: transcriptBg,
                    padding: '15px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${transcriptBorder}`
                }}
            >
                <h4 style={{ fontSize: '1rem', marginTop: '0', marginBottom: '8px' }}>Transcript:</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-wrap' }}>
                    "{transcript}"
                </p>
            </div>
        </div>
    );
};

export default VishingScenario;