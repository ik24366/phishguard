import React from 'react';
import './SocialMediaScenario.css'; // We will create this next

const SocialMediaScenario = ({ sender, subject, body, linkUrl }) => {
    // Helper to determine the visual style based on the subject (e.g., DM vs Public Post)
    const isDirectMessage = subject.toLowerCase().includes('message') || subject.toLowerCase().includes('dm');

    return (
        <div className="social-scenario-container" aria-label="Social Media Simulation">

            {/* Context Header (e.g., "Facebook Messenger" or "Public Tweet") */}
            <div className="social-context-header">
                <span className="context-badge">{subject}</span>
            </div>

            {/* The Fake Post/Message Card */}
            <div className={`social-card ${isDirectMessage ? 'dm-style' : 'post-style'}`}>

                {/* User Profile Area */}
                <div className="social-profile-header">
                    <div className="profile-avatar" aria-hidden="true">
                        {/* Uses the first letter of the sender's name as an avatar */}
                        {sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h3 className="profile-name">
                            {sender}
                            {/* If the sender name includes [Verified Check], render a fake blue tick */}
                            {sender.includes('[Verified Check]') && (
                                <span className="verified-badge" aria-label="Verified Account" title="Verified Account">
                                    ✓
                                </span>
                            )}
                        </h3>
                    </div>
                </div>

                {/* The Main Content */}
                <div className="social-body">
                    <p className="post-text">{body}</p>

                    {/* If there is a suspicious link, render it safely */}
                    {linkUrl && (
                        <div className="social-link-preview">
                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()} // Prevents actual navigation
                                className="suspicious-link"
                                aria-label={`Suspicious link pointing to ${linkUrl}`}
                            >
                                🔗 {linkUrl}
                            </a>
                        </div>
                    )}
                </div>

                {/* Fake Engagement Buttons (Like, Comment, Share) - Hidden from screen readers to reduce noise */}
                {!isDirectMessage && (
                    <div className="social-engagement-bar" aria-hidden="true">
                        <span className="action-button">💬 Reply</span>
                        <span className="action-button">🔁 Repost</span>
                        <span className="action-button">❤️ Like</span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default SocialMediaScenario;