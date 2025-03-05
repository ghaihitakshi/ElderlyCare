// const express = require('express')
// const mongoose= require('mongoose')
// const dotenv = require('dotenv')
// const app = express()
// app.use(express.json())
// dotenv.config()
// console.log("db url",process.env.MONGOOSE_URL);

// mongoose.connect(process.env.MONGOOSE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true //returns promise
// }).then(() =>
//     console.log("db connected"))
//     .catch((err) => console.log("mongodb connection error", err))

// const port = 5000

// app.get('/', (req,res) => {
//     return res.json({
//         message: "oo papa ji oo papa ji",
//         success:true
//     }).status(200)
// })
// app.listen(port, () => {
//     console.log(`app is listening on port ${port}`)
// })

// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const { initCronJobs } = require('./cronJobs'); // Node-cron setup

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error', err);
});

// Creating an HTTP server to attach Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.set('socketio', io);

// Example event listeners for real-time features
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // For real-time chat messages
  socket.on('chatMessage', (msg) => {
    // Broadcast to everyone
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize Scheduled Cron Jobs
initCronJobs();

// Routes
const routes = require('./routes'); // index.js in routes folder
app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running perfectly!',
    success: true,
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});