// utils/notifications.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Use environment variables for email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email reminder about a scheduled task.
 * @param {Object} task - The task object containing details for the reminder.
 * @param {string} [toEmail] - (Optional) Override the email address to send to.
 */
exports.sendReminder = async (task, toEmail) => {
  try {
    // If task has an assignedTo user that is populated, use their email
    let recipientEmail = toEmail;

    if (
      !recipientEmail &&
      task.assignedTo &&
      typeof task.assignedTo === "object" &&
      task.assignedTo.email
    ) {
      recipientEmail = task.assignedTo.email;
    } else {
      recipientEmail = recipientEmail || "recipient@example.com";
    }

    // Customize the email subject & text as needed.
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
