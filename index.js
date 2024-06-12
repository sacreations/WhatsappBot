const { startbot, updateBot } = require('./Bot');
const express = require('express');
const http = require('http'); // Require http module for creating the server
const socketIo = require('socket.io');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create an HTTP server using Express app
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = socketIo(server);


startbot(io);

