const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduledTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    scheduledAt: { type: Date, required: true },
    reminderAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "MISSED"],
      default: "PENDING",
    },
    // Relationships – who created and who is assigned.
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", scheduledTaskSchema);
