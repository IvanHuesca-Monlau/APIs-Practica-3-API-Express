const express = require('express');
const app = express();
const apiPort = process.env.API_PORT || 3000;

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