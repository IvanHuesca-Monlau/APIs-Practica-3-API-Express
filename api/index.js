const express = require('express');
const app = express();
const apiPort = process.env.API_PORT || 3000;

// CORS middleware - DEBE SER PRIMERO
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Import routers
const usersRouter = require('./routes/users');

// Use routers
app.use(usersRouter);

// Server listening
app.listen(apiPort, () => {
  console.log(`El servidor está escuchando en el puerto ${apiPort}`);
});