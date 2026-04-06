const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { protect } = require('../middleware/authMiddleware');

// 1. SAVE A SESSION (POST /api/sessions/save)
router.post('/save', protect, async (req, res) => {
    try {
        const { divineName, count, duration, startTime, endTime } = req.body;

        // We calculate the pure date for the calendar/stats logic
        const sessionDate = new Date(startTime);
        sessionDate.setHours(0, 0, 0, 0);

        const session = await Session.create({
            userId: req.user._id, // Taken from the "Protect" middleware
            divineName,
            count,
            duration,
            startTime,
            endTime,
            sessionDate
        });
        res.status(201).json(session);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. GET ADVANCED STATS (GET /api/sessions/stats)
// This handles the 7, 30, 90, and 365 day logic
router.get('/stats', protect, async (req, res) => {
    const days = parseInt(req.query.days) || 30; // Default to 30 if not specified
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
        // MongoDB Aggregation: This is the "Math Brain"
        const stats = await Session.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    sessionDate: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalChants: { $sum: "$count" },
                    sessions: { $count: {} },
                    totalTime: { $sum: "$duration" },
                    avg: { $avg: "$count" }
                }
            }
        ]);

        // If no sessions found, return zeros instead of an empty error
        res.json(stats[0] || { totalChants: 0, sessions: 0, totalTime: 0, avg: 0 });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Calendar access
router.get('/daily-stats', protect, async (req, res) => {
    const { date } = req.query; // Expects YYYY-MM-DD
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    try {
        const stats = await Session.aggregate([
            { $match: { userId: req.user._id, sessionDate: searchDate } },
            {
                $group: {
                    _id: null,
                    totalChants: { $sum: "$count" },
                    sessions: { $count: {} },
                    avg: { $avg: "$count" }
                }
            }
        ]);
        res.json(stats[0] || { totalChants: 0, sessions: 0, avg: 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});


module.exports = router;