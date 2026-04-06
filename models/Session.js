const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    divineName: { type: String, required: true },
    count: { type: Number, required: true },
    duration: { type: Number, required: true }, // in seconds
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    sessionDate: { type: Date, required: true, index: true }
});
module.exports = mongoose.model('Session', sessionSchema);