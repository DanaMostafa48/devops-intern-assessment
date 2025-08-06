require('dotenv').config();

// require mongoose
const mongoose = require('mongoose');

// connect to database with retry logic
const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    mongoose.connect(process.env.mongoDbUrl, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
    });
};

// acquire the connection (to check if it is successful)
const db = mongoose.connection;

// check for error
db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
    // Don't crash the app, just log the error
});

// once connection is open, log to console
db.once('open', function() {
    console.log('connected to database');
});

// Handle disconnection
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
    // Try to reconnect after 5 seconds
    setTimeout(connectWithRetry, 5000);
});

// Initial connection
connectWithRetry();

module.exports = db;