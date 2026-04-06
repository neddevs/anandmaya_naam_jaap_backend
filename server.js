const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sessionRoutes = require('./routes/sessionRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to receive JSON data from Frontend

app.use('/api/sessions', sessionRoutes);
//routes will start with http://localhost:5000/api/sessions

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send("Naam Jaap API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});