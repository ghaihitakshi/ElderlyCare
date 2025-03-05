// utils/notifications.js
const nodemailer = require("nodemailer");

// Example transporter configuration.
// For production, use real SMTP credentials or environment variables.
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'hotmail', etc.
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_EMAIL_PASSWORD",
  },
});

/**
 * Sends an email reminder about a scheduled task.
 * @param {Object} task - The task object containing details for the reminder.
 * @param {string} [toEmail] - (Optional) Override the email address to send to.
 */
exports.sendReminder = async (task, toEmail) => {
  try {
    // If you want to retrieve or store an email address from somewhere else,
    // you could do it here. In this example, we demonstrate passing the
    // email address as a second argument, or you could get a user email
    // from the task itself if it’s populated.
    const recipientEmail = toEmail || "recipient@example.com";

    // Customize the email subject & text as needed.
    const mailOptions = {
      from: "YOUR_EMAIL@gmail.com",
      to: recipientEmail,
      subject: `Reminder: ${task.title}`,
        text: `Hello! This is a reminder to complete your task: "${task.title}". 

        Task details:
        Description: ${task.description || "No Description"}
        Scheduled At: ${task.scheduledAt}
        Due At: ${task.reminderAt}

        Please ensure it's done before it's missed!`,
    };
      const info = await transporter.sendMail(mailOptions);
    console.log("Reminder email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};
