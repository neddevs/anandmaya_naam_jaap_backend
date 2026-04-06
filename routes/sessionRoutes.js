const express = require('express');
const router = express.Router();
const Session = require('../models/Session'); // Import our Schema

// 1. SAVE A NEW SESSION
// This runs when the user clicks "STOP"
router.post('/save', async (req, res) => {
    try {
        const { divineName, count, startTime, endTime } = req.body;

        // Logic: Extract just the Date (YYYY-MM-DD) from startTime
        // This makes searching by calendar date MUCH easier later.
        const sessionDate = new Date(startTime);
        sessionDate.setHours(0, 0, 0, 0);

        const newSession = new Session({
            divineName,
            count,
            startTime,
            endTime,
            sessionDate
        });

        await newSession.save();
        res.status(201).json({ message: "Session saved successfully!", data: newSession });
    } catch (error) {
        res.status(500).json({ message: "Error saving session", error: error.message });
    }
});

// 2. GET SESSIONS FROM LAST 90 DAYS
router.get('/history', async (req, res) => {
    try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Find sessions where sessionDate is Greater Than or Equal (gte) to 90 days ago
        const sessions = await Session.find({
            sessionDate: { $gte: ninetyDaysAgo }
        }).sort({ startTime: -1 }); // Show newest first

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
});

// 3. GET STATS FOR A SPECIFIC DATE
// The frontend will send a date like "2023-10-25"
router.get('/stats/:date', async (req, res) => {
    try {
        const requestedDate = new Date(req.params.date);
        requestedDate.setHours(0, 0, 0, 0);

        const dailySessions = await Session.find({ sessionDate: requestedDate });
        res.status(200).json(dailySessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching daily stats", error: error.message });
    }
});

module.exports = router;