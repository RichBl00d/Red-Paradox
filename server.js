const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import authentication routes
const { protect } = require('./middleware/authMiddleware'); // Import the auth middleware

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://arrowgoldsmith:P8hajiV2xEq96C9x@cluster0.720ld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Add authentication routes
app.use('/api/auth', authRoutes); // API routes for authentication

// Example of a protected route
app.post('/api/messages', protect, (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Please provide a message' });
  }

  // Here, you would handle storing the message in MongoDB (optional)
  res.status(200).json({ message: 'Message sent successfully', data: { userId: req.user.id, message } });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
