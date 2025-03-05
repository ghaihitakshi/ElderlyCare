// cronJobs.js
const cron = require("node-cron");
const Task = require("./models/Task"); // The ScheduledTask model
const { sendReminder } = require("./utils/notifications"); // custom function to send reminder

const initCronJobs = () => {
  // Runs every minute - adjust according to desired schedule
  cron.schedule("* * * * *", async () => {
    try {
      // Find tasks whose reminderAt is within the next minute and not completed
      const now = new Date();
      const tasksToRemind = await Task.find({
        reminderAt: { $lte: now },
        status: "PENDING",
      });

      tasksToRemind.forEach((task) => {
        // Send a reminder notification (email, SMS, push, etc.)
        sendReminder(task);
        console.log("Reminder sent for task:", task.title);
      });
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

module.exports = { initCronJobs };
