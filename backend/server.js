const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'HomeFinder API is running' });
});

// Socket.io — real time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userID) => {
    socket.join(userID);
    console.log(`User ${userID} joined their room`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.receiverID).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});