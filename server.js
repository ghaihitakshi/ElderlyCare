// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const { initCronJobs } = require("./cronJobs"); // Node-cron setup

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS with specific options
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Add your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit with failure if cannot connect to database
  });

// Creating an HTTP server to attach Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("socketio", io);

// Example event listeners for real-time features
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // For real-time chat messages
  socket.on("chatMessage", (msg) => {
    // Broadcast to everyone
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Initialize Scheduled Cron Jobs
initCronJobs();

// Routes
const routes = require("./routes"); // index.js in routes folder
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running perfectly!",
    success: true,
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
