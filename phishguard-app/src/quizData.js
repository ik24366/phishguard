// src/data/quizData.js
export const modules = [
  {
    id: "email-basics",
    title: "Email Phishing Basics",
    totalQuestions: 10,
    scenarios: [
      {
        id: 1,
        type: "email",
        text: {
          from: '"IT Support" <security-update@company-support.com>',
          subject: "Urgent: Your account will be disabled",
          body: [
            "Your password has expired. Click the link below within 24 hours to keep your account active:",
            "http://company-support-security.com/reset"
          ],
        },
        correctAnswer: "phishing",
        explanation:
          "The sender address is suspicious, the link does not use the official domain, and there is urgent pressure to act quickly.",
      },
      {
        id: 2,
        type: "email",
        text: {
          from: '"HR" <hr@yourcompany.com>',
          subject: "Updated holiday policy",
          body: [
            "We have updated our holiday policy. Please log in to the HR portal from the normal intranet link to review the details.",
            "Do not share your credentials with anyone."
          ],
        },
        correctAnswer: "legitimate",
        explanation:
          "The sender address uses the correct company domain and avoids asking you to click unknown external links or share your password.",
      },
      // add more later if you have time
    ],
  },
  {
    id: "sms-alerts",
    title: "SMS & Mobile Alerts",
    totalQuestions: 8,
    scenarios: [
      {
        id: 1,
        type: "sms",
        text: {
          from: "+44 7700 900123",
          body: [
            "Your bank account is locked. Verify now: http://secure-bank-login-help.com",
          ],
        },
        correctAnswer: "phishing",
        explanation:
          "Banks do not send generic links with unfamiliar domains in SMS; they ask you to use their official app or website.",
      },
    ],
  },
];
