const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); // Import Socket.IO

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://arrowgoldsmith:P8hajiV2xEq96C9x@cluster0.720ld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// HTTP Server setup
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin (update this in production)
    methods: ["GET", "POST"],
  },
});

// Real-time communication logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for messages from clients
  socket.on('sendMessage', (data) => {
    console.log("Message received:", data);

    // Broadcast message to all connected clients
    io.emit('receiveMessage', { user: socket.id, text: data });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API Routes (example of existing routes)
app.get('/api', (req, res) => {
  res.send('API is working');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
