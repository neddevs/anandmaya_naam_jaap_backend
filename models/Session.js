const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    divineName: {
        type: String,
        enum: ['Ram', 'Radha', 'Krishna', 'Shiva', 'Durga', 'Hanuman', 'Ganesh', 'Others'],
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    },
    startTime: {
        type: Date,
        required:true
    },

    endTime: {
        type: Date,
        required: true,
    },

    // 4. Pure Date (Calculated for easier 90-day calendar filtering)
    // We store this as YYYY-MM-DD so we don't have to deal with minutes/seconds when searching
    sessionDate: {
        type: Date,
        required: true,
        index: true // index makes searching by date much faster
    }
}, {
    timestamps: true // This automatically adds 'createdAt' and 'updatedAt' fields
});

// Create the Model
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
